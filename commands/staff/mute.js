const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const path = require("path");
const { config } = require("../..");
const {
  messageInfo,
  messageError,
  messagePermission,
  messageSuccess,
} = require(path.join(process.cwd(), "/utils/customMessages.js"));

module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the mute.")
        .setRequired(false)
    ),

  /**
   * Execute function for the "mute" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction) {
    try {
      const userMute = interaction.options.getUser("user");
      const reasonMute = interaction.options.getString("reason");
      const member = interaction.guild.members.cache.get(interaction.user.id);
	  console.log(config.roles.muted);
      const muteRole = await interaction.guild.roles.fetch(
        config.roles.muted
      );
      const memberToMute = await interaction.guild.members
        .fetch(userMute.id)
        .catch(() => null);
      const logChannelId = config.channels.logs;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      // Check if the mute role exists
      if (!muteRole) {
        console.error("Mute role not found.");
        return;
      }

      // Check permissions of the member executing the command
      if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await interaction.reply({
          embeds: [
            messagePermission(
              "Insufficient Permissions!",
              "You do not have permission to use this command!"
            ),
          ],
          ephemeral: true,
        });
      }

      // Check if a user to mute was provided
      if (!userMute) {
        return await interaction.reply({
          embeds: [
            messageInfo(
              "Incomplete Information!",
              "You must mention the user you want to mute."
            ),
          ],
          ephemeral: true,
        });
      }

      // Check if the user has permissions to be muted
      if (
        memberToMute &&
        memberToMute.permissions.has(PermissionFlagsBits.ManageRoles)
      ) {
        return await interaction.reply({
          embeds: [messageError("ERROR!", "You cannot mute this user.")],
          ephemeral: true,
        });
      }

      // Assign the mute role to the user
      if (memberToMute) {
        await memberToMute.roles.add(muteRole);
        const muteMessage = reasonMute
          ? `User ${userMute.tag} has been muted.\nReason: **${reasonMute}**.`
          : `User ${userMute.tag} has been muted.`;

        // Send initial response
        await interaction
          .reply({
            embeds: [messageSuccess("You muted a user", muteMessage)],
            ephemeral: true,
          })
          .then((message) => {
            setTimeout(() => {
              message.delete();
            }, 5000);
          });

        if (logChannel) {
          // Send the log message to the destination channel
          const logMessage = reasonMute
            ? `${userMute.tag} has been muted by ${interaction.member.displayName}.\nReason: **${reasonMute}**`
            : `${userMute.tag} has been muted by ${interaction.member.displayName}.`;
          await logChannel.send({
            embeds: [messageInfo("User Muted!", logMessage)],
          });
        } else {
          console.error("Destination channel not found.");
        }
      } else {
        console.error("User to mute not found.");
        return await interaction.reply({
          embeds: [messageError("ERROR!", "User to mute not found.")],
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("[MUTE]", error);
      await interaction.reply({
        embeds: [messageError("Error while muting!", `${error}`)],
        ephemeral: true,
      });
    }
  },
};
