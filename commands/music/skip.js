const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'Música',
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Salta la canción!')
		.addNumberOption((option) =>
			option
				.setName('id')
				.setDescription('ID')
				.setRequired(false)
				.setAutocomplete(true),
		),

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

		const id = await interaction.options.getNumber('id');

		if (!id) {
			queue.skip();
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('Default')
						.setDescription('⏩ | ¡Saltado a la siguiente canción!'),
				],
			});
		}

		if (id) {
			try {
				const songSkip = queue.songs[parseInt(id - 1)];
				await client.distube.jump(interaction, parseInt(id - 1));

				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor('Default')
							.setDescription(
								`⏩ | Movido a la canción con ID: ${ id }: **${ songSkip.name }**!`,
							),
					],
				});
			}
			catch (err) {
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor('Red')
							.setDescription(
								`🚫 | ¡Canción con ID no encontrada: ${ id }!`,
							),
					],
					ephemeral: true,
				});
			}
		}
	},

	async autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused();
		const queue = await client.distube.getQueue(interaction);

		const tracks = queue.songs
			.slice(0, Math.min(queue.songs.length, 25))
			.map((song, i) => ({
				name: `${ i + 1 }. ${ song.name }`,
				value: i + 1,
			}));

		const filtered = tracks.filter((track) =>
			track.name.startsWith(focusedValue),
		);

		await interaction.respond(
			filtered.map((track) => ({
				name: track.name,
				value: track.value,
			})),
		);
	},
};
