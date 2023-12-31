const { DisTube } = require('distube');
const client = require('../index.js');
const { EmbedBuilder } = require('discord.js');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

const Format = Intl.NumberFormat();
const spotifyOptions = {
	parallel: true,
	emitEventsAfterFetching: false,
};
// const { getVoiceConnection }= require('@discordjs/voice');

client.distube = new DisTube(client, {
	leaveOnStop: false,
	leaveOnEmpty: true,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: true,
	emitAddListWhenCreatingQueue: true,
	//youtubeDL: true,
	//youtubeCookie: client.config.cookie,
	plugins: [new SpotifyPlugin(spotifyOptions), new SoundCloudPlugin()],
});

// if (client.config.spotifyApi.enabled) {
// 	spotifyOptions.api = {
// 		clientId: client.config.spotifyApi.clientId,
// 		clientSecret: client.config.spotifyApi.clientSecret,
// 	};
// }

const obtenerEstado = (cola) =>
	`Volumen: \`${ cola.volume }%\` | Filtro: \`${ cola.filters.names.join(', ') || 'Apagado' }\` | Repetir: \`${ cola.repeatMode ? (cola.repeatMode === 2 ? 'Lista' : 'Canción') : 'Apagado' }\` | Autoplay: \`${ cola.autoplay ? 'Activado' : 'Desactivado' }\``;

client.distube.on('addSong', async (cola, cancion) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Default')
				.setAuthor({
					name: 'Añadiste una canción a la cola',
					iconURL: client.user.avatarURL(),
				})
				.setDescription(`> [**${ cancion.name }**](${ cancion.url })`)
				.setThumbnail(cancion.user.displayAvatarURL())
				.addFields([
					{
						name: '⏱️ | Duración',
						value: `${ cancion.formattedDuration }`,
						inline: true,
					},
					{
						name: '🎵 | Subido por',
						value: `[${ cancion.uploader.name }](${ cancion.uploader.url })`,
						inline: true,
					},
					{
						name: '👌 | Solicitada por',
						value: `${ cancion.user }`,
						inline: true,
					},
				])
				.setImage(cancion.thumbnail)
				.setFooter({
					text: `${ Format.format(cola.songs.length) } canciones en cola`,
				}),
		],
	});

	setTimeout(() => {
		mensaje.delete();
	}, 8000);
});

client.distube.on('addList', async (cola, listaReproduccion) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Default')
				.setAuthor({
					name: 'Añadir lista de reproducción a la cola',
					iconURL: client.user.avatarURL(),
				})
				.setThumbnail(listaReproduccion.user.displayAvatarURL())
				.setDescription(`> [**${ listaReproduccion.name }**](${ listaReproduccion.url })`)
				.addFields([
					{
						name: '⏱️ | Duración',
						value: `${ listaReproduccion.formattedDuration }`,
						inline: true,
					},
					{
						name: '👌 | Solicitada por',
						value: `${ listaReproduccion.user }`,
						inline: true,
					},
				])
				.setImage(listaReproduccion.thumbnail)
				.setFooter({
					text: `${ Format.format(cola.songs.length) } canciones en cola`,
				}),
		],
	});

	setTimeout(() => {
		mensaje.delete();
	}, 20000);
});

client.distube.on('playSong', async (cola, cancion) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Default')
				.setAuthor({
					name: 'Reproduciendo ahora',
					iconURL: client.user.avatarURL(),
				})
				.setDescription(`> [**${ cancion.name }**](${ cancion.url })`)
				.setThumbnail(cancion.user.displayAvatarURL())
				.addFields([
					{
						name: '🔷 | Estado',
						value: `${ obtenerEstado(cola).toString() }`,
						inline: false,
					},
					{
						name: '⏱️ | Duración',
						value: `${ cancion.formattedDuration }`,
						inline: true,
					},

					{
						name: '👌 | Solicitada por',
						value: `${ cancion.user }`,
						inline: true,
					},
					{
						name: '📻 | Reproducir música en',
						value: `
                                ┕🔊 | ${ client.channels.cache.get(cola.voiceChannel.id) }
                                ┕🪄 | ${ cola.voiceChannel.bitrate / 1000 } kbps`,
						inline: false,
					},
				])
				.setImage(cancion.thumbnail)
				.setFooter({
					text: `${ Format.format(cola.songs.length) } canciones en cola`,
				}),
		],
	});

	setTimeout(() => {
		mensaje.delete();
	}, 1000 * 60 * 2);
});

client.distube.on('empty', async (cola) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Red')
				.setDescription(
					'🚫 | La sala está vacía, ¡el bot sale automáticamente de la sala!',
				),
		],
	});
	setTimeout(() => {
		mensaje.delete();
	}, 20000);
});

client.distube.on('error', async (canal, error) => {
	const mensaje = await canal.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Red')
				.setDescription(
					`🚫 | ¡Se ha producido un error!\n\n** ${ error
						.toString()
						.slice(0, 1974) }**`,
				),
		],
	});
	setTimeout(() => {
		mensaje.delete();
	}, 20000);
});

client.distube.on('disconnect', async (cola) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Red')
				.setDescription('🚫 | ¡El bot se ha desconectado del canal de voz!'),
		],
	});
	setTimeout(() => {
		mensaje.delete();
	}, 20000);
});

client.distube.on('finish', async (cola) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Red')
				.setDescription(
					'🚫 | ¡Todas las canciones de la lista de reproducción se han reproducido!',
				),
		],
	});
	setTimeout(() => {
		mensaje.delete();
	}, 20000);
});

client.distube.on('initQueue', async (cola) => {
	cola.autoplay = true;
	cola.volume = 100;
});

client.distube.on('noRelated', async (cola) => {
	const mensaje = await cola.textChannel.send({
		embeds: [
			new EmbedBuilder()
				.setColor('Red')
				.setDescription('🚫 | ¡Canción no encontrada!'),
		],
	});
	setTimeout(() => {
		mensaje.delete();
	}, 20000);
});
