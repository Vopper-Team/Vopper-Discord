/* eslint-disable no-unused-vars */
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

const path = require("node:path");
const { config } = require("../..");
const {
  messageInfo,
  messageError,
  messagePermission,
  messageSuccess,
} = require(path.join(process.cwd(), "/utils/customMessages.js"));

/**
 * Ban a user with an optional reason.
 * @param {GuildMember} memberToBan - The member to be banned.
 * @param {string} reasonBan - The reason for the ban.
 */
async function banUser(memberToBan, reasonBan) {
  if (!reasonBan) {
    await memberToBan.ban();
  } else {
    await memberToBan.ban({ reason: reasonBan, deleteMessageSeconds: 0 });
  }
}

/**
 * Send a ban confirmation message to the interaction's user.
 * @param {ChatInputCommandInteraction} interaction - The interaction object.
 * @param {User} userBan - The user who is banned.
 * @param {string} reasonBan - The reason for the ban.
 */
async function sendBanConfirmation(interaction, userBan, reasonBan) {
  const successMessage = reasonBan
    ? `User ${userBan.tag} has been banned.\nReason: **${reasonBan}**`
    : `User ${userBan.tag} has been banned.`;

  await interaction
    .reply({
      embeds: [messageSuccess("User Banned", successMessage)],
      ephemeral: true,
    })
    .then((message) => {
      setTimeout(
        () => {
          message.delete();
        },
        reasonBan ? 5000 : 15000
      );
    });
}

/**
 * Send a ban log to a specified channel.
 * @param {TextChannel} canalDestino - The destination channel for ban logs.
 * @param {ChatInputCommandInteraction} interaction - The interaction object.
 * @param {User} userBan - The user who is banned.
 * @param {string} reasonBan - The reason for the ban.
 */
async function sendBanLog(canalDestino, interaction, userBan, reasonBan) {
  if (canalDestino) {
    const logMessage = reasonBan
      ? `User ${userBan.tag} has been banned.\nReason: **${reasonBan}**`
      : `${userBan.tag} has been banned by ${interaction.member.displayName}`;

    // Send the log message to the destination channel
    await canalDestino.send({
      embeds: [messageInfo("User Banned!", logMessage)],
    });
  } else {
    console.error("Destination channel not found.");
  }
}

module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Ban reason.").setRequired(false)
    ),

  /**
   * Execute function for the "ban" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction) {
    try {
      const userBan = interaction.options.getUser("user");
      const reasonBan = interaction.options.getString("reason");
      const member = interaction.guild.members.cache.get(interaction.user.id);

      // Get the member from the server to be banned
      const memberToBan = interaction.guild.members.cache.get(userBan.id);

      // Log channel
      const logChannelId = config.channels.logs;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      // Check permissions to ban users
      if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
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

      // Check if a user to ban was provided
      if (!userBan) {
        return await interaction.reply({
          embeds: [
            messageInfo(
              "Incomplete Information!",
              "You must mention the user you want to ban."
            ),
          ],
          ephemeral: true,
        });
      }

      // Check if the user has permissions to be banned
      if (
        !memberToBan ||
        memberToBan.permissions.has(PermissionFlagsBits.BanMembers)
      ) {
        return await interaction.reply({
          embeds: [messageError("ERROR!", "You cannot ban this user.")],
          ephemeral: true,
        });
      }

      await banUser(memberToBan, reasonBan);
      await sendBanConfirmation(interaction, userBan, reasonBan);
      await sendBanLog(logChannel, interaction, userBan, reasonBan);
    } catch (error) {
      return await interaction.reply({
        embeds: [messageError("Error Banning User!", `${error}`)],
        ephemeral: true,
      });
    }
  },
};
