const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	category: 'Música',
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Detener la reproducción de música'),

	/**
     * @param {ChatInputCommandInteraction} interaction
     * @param {*} client
     */
	async execute(interaction, client) {
		const voiceChannel = interaction.member.voice.channel;
		const queue = await client.distube.getQueue(interaction);

		if (!voiceChannel) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('Red')
						.setDescription(
							'🚫 | ¡Debes estar en un canal de voz para usar este comando!',
						),
				],
			});
		}

		if (interaction.guild.members.me.voice.channelId !== voiceChannel.id) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('Red')
						.setDescription(
							'🚫 | ¡Debes estar en el mismo canal de voz que el bot!',
						),
				],
			});
		}

		queue.stop();
		client.distube.voices.leave(interaction);
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Default')
					.setDescription('🔇 | ¡Se detuvo la reproducción de música!'),
			],
		});
	},
};
