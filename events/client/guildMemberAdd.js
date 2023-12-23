// eslint-disable-next-line no-unused-vars
const { GuildMember, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

// Función para aplicar texto al lienzo (canvas)
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declarar un tamaño base para la fuente
	let fontSize = 60;

	do {
		try {
			// Intentar cargar la fuente específica
			context.font = `${(fontSize -= 10)}px Geist Mono Regular`;
		}
		catch (error) {
			// En caso de error, utilizar una fuente genérica
			context.font = `${(fontSize -= 10)}px sans-serif`;
		}

		// Comparar el ancho en píxeles del texto con el ancho del lienzo menos el tamaño aproximado del avatar
	} while (context.measureText(text).width > canvas.width - 300);

	// Devolver el resultado para usarlo en el lienzo real
	return context.font;
};
/**
 *
 * @param {GuildMember} member
 * @returns
 */
async function createCanvas(member) {
	// Crear un lienzo (canvas) con dimensiones 700x250
	const canvas = Canvas.createCanvas(800, 350);
	const context = canvas.getContext('2d');
	const background = await Canvas.loadImage(
		'./assets/img/background-canvas.png',
	);

	// Utilizar las dimensiones del lienzo para estirar la imagen sobre todo el lienzo
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Agregar el nombre del usuario y un mensaje de bienvenida
	context.font = applyText(canvas, `${member.displayName}`);
	context.fillStyle = '#ffffff';
	const textWidth = context.measureText(`${member.displayName}`).width;
	context.fillText(
		`${member.displayName}`,
		(canvas.width - textWidth) / 2,
		canvas.height - 100,
	);

	// Agregar un mensaje de bienvenida
	context.font = '24px Geist Mono Regular';
	context.fillStyle = '#ffffff';
	const welcomeText = '¡Bienvenido a Vopper!';
	const welcomeTextWidth = context.measureText(welcomeText).width;
	context.fillText(
		welcomeText,
		(canvas.width - welcomeTextWidth) / 2,
		canvas.height - 65,
	);

	// Agregar un mensaje "Es un placer tenerte aquí"
	context.font = '18px Geist Mono Regular';
	context.fillStyle = '#ffffff';
	const pleasureText = '¡Es un placer tenerte aquí!';
	const pleasureTextWidth = context.measureText(pleasureText).width;
	context.fillText(
		pleasureText,
		(canvas.width - pleasureTextWidth) / 2,
		canvas.height - 35,
	);

	// Usar undici para hacer solicitudes HTTP para un mejor rendimiento
	const { body } = await request(
		member.user.displayAvatarURL({ format: 'jpg', size: 512 }),
	);

	// Dibujar la imagen del avatar en el lienzo principal
	const avatar = await Canvas.loadImage(await body.arrayBuffer());
	context.drawImage(avatar, 341, 50, 120, 120);

	// Usar la clase AttachmentBuilder para procesar el archivo
	const attachment = new AttachmentBuilder(await canvas.encode('png'), {
		name: 'background.png',
	});

	return attachment;
}

// ready.js
module.exports = {
	name: 'guildMemberAdd',
	once: false,
	/**
   * @param {GuildMember} member
   */
	async execute(member) {
		if (!member.user) return;
		if (member.guild.channels.cache.has('1187920201732333590')) {
			const welcomeChannel = member.guild.channels.cache.get(
				'1187920201732333590',
			);
			const welcomeCanva = await createCanvas(member);
			welcomeChannel.send({ files: [welcomeCanva] });
		}
	},
};
