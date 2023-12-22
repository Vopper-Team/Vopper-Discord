/* eslint-disable no-unused-vars */
const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
	Cooldown: ms('20s'),
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription('Cursos de React disponibles!'),

	/**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('¡Descubre React! 🚀✨')
			.setDescription('👉 ¡Atención desarrolladores! 🚀 Descubre todos nuestros cursos de Angular en el canal #「🔧」𝐑𝐞𝐚𝐜𝐭 . 📚 Sumérgete en un mar de conocimiento y lleva tus habilidades a nuevas alturas. ¡Te esperamos para aprender juntos! 💻✨')
			.setColor(2326507);
		await interaction.channel.send({ embeds: [embed] });


	},
};
