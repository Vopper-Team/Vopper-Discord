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
    .setName("kick")
    .setDescription("Kick a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the kick.")
        .setRequired(false)
    ),

  /**
   * Execute function for the "kick" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction) {
    const userKick = interaction.options.getUser("user");
    const reasonKick = interaction.options.getString("reason") || "";
    const member = interaction.guild.members.cache.get(interaction.user.id);

    // Get the member from the server to be kicked
    const memberToKick = interaction.guild.members.cache.get(userKick.id);

    // Log channel
    const logChannelId = config.channels.logs;
    const logChannel = interaction.guild.channels.cache.get(logChannelId);

    // Check permissions to kick users
    if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
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

    // Check if a user to kick was provided
    if (!userKick) {
      return await interaction.reply({
        embeds: [
          messageInfo(
            "Incomplete Information!",
            "You must mention the user you want to kick."
          ),
        ],
        ephemeral: true,
      });
    }

    // Check if the user has permissions to be kicked
    if (
      !memberToKick ||
      memberToKick.permissions.has(PermissionFlagsBits.KickMembers)
    ) {
      return await interaction.reply({
        embeds: [messageError("ERROR!", "You cannot kick this user.")],
        ephemeral: true,
      });
    }

    const kickMessage = reasonKick
      ? `User ${userKick.tag} has been kicked.\nReason: **${reasonKick}**.`
      : `User ${userKick.tag} has been kicked.`;

    // Kick the user
    try {
      await memberToKick.kick();
      await interaction
        .reply({
          embeds: [messageSuccess("You kicked a user", kickMessage)],
          ephemeral: true,
        })
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });

      if (logChannel) {
        const logMessage = reasonKick
          ? `${userKick.tag} has been kicked by ${interaction.member.displayName}.\nReason: **${reasonKick}**`
          : `${userKick.tag} has been kicked by ${interaction.member.displayName}`;
        // Send the log message to the destination channel
        await logChannel.send({
          embeds: [messageInfo("User Kicked!", logMessage)],
        });
      } else {
        console.error("Destination channel not found.");
      }
    } catch (error) {
      return await interaction.reply({
        content: `${error.message}`,
        ephemeral: true,
      });
    }
  },
};
