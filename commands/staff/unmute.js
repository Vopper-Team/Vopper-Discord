const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
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
    .setName("unmute")
    .setDescription("Unmute a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to unmute.")
        .setRequired(true)
    ),

  /**
   * Execute function for the "unmute" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   * @returns
   */
  async execute(interaction) {
    try {
      const userUnmute = interaction.options.getUser("user");
      const member = interaction.guild.members.cache.get(interaction.user.id);
	  console.log(config.roles.muted);
      const muteRole = await interaction.guild.roles.fetch(
        config.roles.muted
      );
      const memberToUnmute = await interaction.guild.members
        .fetch(userUnmute.id)
        .catch(() => null);
      const logChannelId = config.channels.logs;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

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

      // Check if a user to unmute is provided
      if (!userUnmute) {
        return await interaction.reply({
          embeds: [
            messageInfo(
              "Missing Information!",
              "You must mention the user you want to unmute."
            ),
          ],
          ephemeral: true,
        });
      }

      // Unmute the user
      if (memberToUnmute) {
        await memberToUnmute.roles.remove(muteRole);
        await interaction
          .reply({
            embeds: [
              messageSuccess(
                "You unmuted a user",
                `The user ${userUnmute.tag} has been unmuted.`
              ),
            ],
            ephemeral: true,
          })
          .then((message) => {
            setTimeout(() => {
              message.delete();
            }, 5000);
          });

        if (logChannel) {
          // Send the log message to the destination channel
          await logChannel.send({
            embeds: [
              messageInfo(
                "User Unmuted!",
                `${userUnmute.tag} has been unmuted by ${interaction.member.displayName}.`
              ),
            ],
          });
        } else {
          console.error("Destination channel not found.");
        }
      } else {
        console.error("User to unmute not found.");
        return await interaction.reply({
          embeds: [messageError("ERROR!", "User to unmute not found.")],
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log("[UNMUTE]", error);
      await interaction.reply({
        embeds: [messageError("An error occurred while unmuting!", `${error}`)],
        ephemeral: true,
      });
    }
  },
};
