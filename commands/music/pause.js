const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'Música',
	data: new SlashCommandBuilder()
		.setName('pausar')
		.setDescription('¡Pausa la canción actual!'),

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
							'🚫 | ¡Necesitas estar en el mismo canal de voz que el bot!',
						),
				],
			});
		}

		queue.pause();
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Default')
					.setAuthor({
						name: 'Pausar',
						iconURL: client.user.displayAvatarURL(),
					})
					.setDescription('⏸️ | ¡Pausar reproducción de la canción actual!'),
			],
		});
	},
};
