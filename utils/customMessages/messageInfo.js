// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @returns {Object} - Objeto que contiene el mensaje embed y archivos adjuntos
 */
function buildMessage(titulo, descripcion) {
	// Construir el mensaje embed
	const embed = new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(2326507)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1076/1076337.png');

	// Devolver el mensaje embed con el archivo adjunto
	return { embed };
}

module.exports = buildMessage;
