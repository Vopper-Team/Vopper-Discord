// eslint-disable-next-line no-unused-vars
const { GuildMember, AttachmentBuilder } = require('discord.js');
const { GlobalFonts } = require('@napi-rs/canvas');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const path = require('path');

// Función para cargar la fuente personalizada desde una carpeta
const loadCustomFont = () => {
	try {
		GlobalFonts.registerFromPath(path.join(process.cwd(), '/assets/fonts/GeistMono-Regular.otf'), 'Geist Mono Regular');
		console.log('Fuente cargada con éxito.');
	}
	catch (error) {
		console.error('Error al cargar la fuente:', error);
	}
};

// Función para aplicar texto al lienzo (canvas)
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 60;

	do {
		try {
			// Utilizar la fuente personalizada
			context.font = `${(fontSize -= 10)}px 'Geist Mono Regular', sans-serif`;
		}
		catch (error) {
			// En caso de error, utilizar una fuente genérica
			context.font = `${(fontSize -= 10)}px sans-serif`;
		}
	} while (context.measureText(text).width > canvas.width - 300);

	// Devolver el resultado para usarlo en el lienzo real
	return context.font;
};

/**
 *
 * @param {GuildMember} member
 * @returns {Promise<AttachmentBuilder>}
 */
async function createCanvas(member) {
	// Crear un lienzo (canvas) con dimensiones 800x350
	const canvas = Canvas.createCanvas(800, 350);
	const context = canvas.getContext('2d');
	const background = await Canvas.loadImage('./assets/img/background-canvas.png');

	// Utilizar las dimensiones del lienzo para estirar la imagen sobre todo el lienzo
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Cargar la fuente personalizada
	loadCustomFont();

	// Agregar el nombre del usuario y un mensaje de bienvenida
	context.font = applyText(canvas, `${member.displayName}`);
	context.fillStyle = '#ffffff';
	const textWidth = context.measureText(`${member.displayName}`).width;
	context.fillText(`${member.displayName}`, (canvas.width - textWidth) / 2, canvas.height - 100);

	// Agregar un mensaje de bienvenida
	context.font = '24px Geist Mono Regular';
	context.fillStyle = '#ffffff';
	const welcomeText = '¡Bienvenido a Vopper!';
	const welcomeTextWidth = context.measureText(welcomeText).width;
	context.fillText(welcomeText, (canvas.width - welcomeTextWidth) / 2, canvas.height - 65);

	// Agregar un mensaje "Es un placer tenerte aquí"
	context.font = '18px Geist Mono Regular';
	context.fillStyle = '#ffffff';
	const pleasureText = '¡Es un placer tenerte aquí!';
	const pleasureTextWidth = context.measureText(pleasureText).width;
	context.fillText(pleasureText, (canvas.width - pleasureTextWidth) / 2, canvas.height - 35);

	// Usar undici para hacer solicitudes HTTP para un mejor rendimiento
	const { body } = await request(member.user.displayAvatarURL({ format: 'jpg', size: 512 }));

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
		const channelId = '1187920201732333590';

		if (member.guild.channels.cache.has(channelId)) {
			const welcomeChannel = member.guild.channels.cache.get(channelId);
			const welcomeCanvas = await createCanvas(member);
			welcomeChannel.send({ files: [welcomeCanvas] });
		}
	},
};