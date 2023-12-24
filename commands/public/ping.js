// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const ms = require('ms');

module.exports = {
	Cooldown: ms('1m'),
	data: new SlashCommandBuilder().setName('ping').setDescription('pog'),
	/**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction, client) {
		return interaction.reply({ content: `Tu ping es: ${client.ws.ping}ms.` });
	},
};
