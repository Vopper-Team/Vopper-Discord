const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'Música',
	data: new SlashCommandBuilder()
		.setName('continuar')
		.setDescription('¡Continuar reproducción!'),

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


		queue.resume();
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Default')
					.setAuthor({
						name: 'Continuar',
						iconURL: client.user.displayAvatarURL(),
					})
					.setDescription('⏯️ | ¡Continuar reproducción de la canción actual!'),
			],
		});
	},
};
