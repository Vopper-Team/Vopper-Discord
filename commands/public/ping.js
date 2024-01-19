const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const ms = require('ms');

module.exports = {
  // Command cooldown set to 10 seconds
  Cooldown: ms('10s'),

  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s ping'),

  /**
   * Execute function for the "ping" command.
   * @param {Client} client - The Discord client instance.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction, client) {
    // Reply to the user with the bot's ping
    return interaction.reply({ content: `Your ping is: ${client.ws.ping}ms.` });
  },
};
