const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'Música',
	data: new SlashCommandBuilder()
		.setName('cola')
		.setDescription('¡Ver la lista de canciones en la cola!'),

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

		const q = queue.songs
			.map(
				(song, i) =>
					`${ i === 0 ? 'Reproduciendo:' : `${ i }.` } ${ song.name } - \`${
						song.formattedDuration
					}\``,
			)
			.join('\n');

		const tracks = queue.songs.map(
			(song, i) => `**${ i + 1 }** - [${ song.name }](${ song.url }) | ${
				song.formattedDuration
			}\nSolicitada por: ${ song.user }`,
		);

		const songs = queue.songs.length;
		const nextSongs =
            songs > 10
            	? `Y **${ songs - 10 }** canciones más...`
            	: `Lista de reproducción con **${ songs }** canciones...`;

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Default')
					.setAuthor({
						name: 'Cola',
						iconURL: client.user.displayAvatarURL(),
					})
					.setDescription(
						`${ tracks.slice(0, 10).join('\n') }\n\n${ nextSongs }`,
					)
					.addFields([
						{
							name: '> Reproduciendo:',
							value: `[${ queue.songs[0].name }](${ queue.songs[0].url }) - ${ queue.songs[0].formattedDuration } | Solicitada por: ${ queue.songs[0].user }`,
							inline: true,
						},
						{
							name: '> Tiempo total:',
							value: `${ queue.formattedDuration }`,
							inline: true,
						},
						{
							name: '> Total de canciones:',
							value: `${ songs }`,
							inline: true,
						},
					]),
			],
		});
	},
};
