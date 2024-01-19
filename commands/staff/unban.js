const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const path = require('node:path');
const { config } = require('../..');
const { messagePermission, messageSuccess, messageError, messageInfo } = require(path.join(process.cwd(), '/utils/customMessages.js'));

module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user.')
    .addUserOption(option =>
      option.setName('user').setDescription('The user you want to unban.').setRequired(true),
    ),

  /**
   * Execute function for the "unban" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction) {
    try {
      const userUnban = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(interaction.user.id);
      const logChannelId = config.channels.logs;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      // Get the list of banned users in the server
      const bans = await interaction.guild.bans.fetch();

      // Check if the user is in the list of banned users
      const isBanned = bans.has(userUnban.id);

      // Check permissions to unban users
      if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return await interaction.reply({
          embeds: [messagePermission('Insufficient Permissions!', 'You do not have permission to use this command!')],
          ephemeral: true,
        });
      }

      if (!isBanned) {
        return await interaction.reply({
          embeds: [messageError('ERROR!', 'This user is not banned.')],
          ephemeral: true,
        });
      }

      // Unban the user
      await interaction.guild.bans.remove(userUnban.id);
      await interaction.reply({
        embeds: [
          messageSuccess(
            'You unbanned a user',
            `The user ${userUnban.tag} has been unbanned.`,
          ),
        ],
        ephemeral: true,
        fetchReply: true,
      }).then((message) => {
        setTimeout(() => {
          message.delete();
        }, 5000);
      });

      if (logChannel) {
        // Send the log message to the destination channel
        const logMessage = `${userUnban.tag} has been unbanned by ${interaction.member.displayName}.`;
        await logChannel.send({
          embeds: [messageInfo('User Unbanned!', logMessage)],
        });
      } else {
        console.error('Destination channel not found.');
      }
    } catch (error) {
      console.log('[UNBAN]', error);
      return await interaction.reply({
        content: `${error.message}`,
        ephemeral: true,
      });
    }
  },
};
