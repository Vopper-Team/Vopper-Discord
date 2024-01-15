const { EmbedBuilder } = require('discord.js');


/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @param {string} [footer='']
 * @returns {EmbedBuilder} - Objeto que contiene el mensaje embed.
 */
function messageInfo(titulo, descripcion) {
	// Devolver el mensaje embed con el archivo adjunto
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(2326507)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1076/1076337.png');
}

/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @returns {EmbedBuilder} - Objeto que contiene el mensaje embed.
 */
function messageWarning(titulo, descripcion) {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(14022154)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1187/1187737.png');
}

/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @returns {EmbedBuilder} - Objeto que contiene el mensaje embed.
 */
function messageError(titulo, descripcion) {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(16058890)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/9094/9094443.png');
}

/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @returns {EmbedBuilder} - Objeto que contiene el mensaje embed.
 */
function messagePermission(titulo, descripcion) {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(12041422)
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/3558/3558827.png');
}

/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @returns {EmbedBuilder} - Objeto que contiene el mensaje embed.
 */
function messageSuccess(titulo, descripcion) {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(776192)
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1828/1828644.png');
}

/**
 *
 * @param {string} titulo
 * @param {string} descripcion
 * @param {*} [footer={}]
 * @returns {EmbedBuilder} - Objeto que contiene el mensaje embed.
 */
function messageCoupon(titulo, descripcion, footer = {}) {
	// Devolver el mensaje embed con el archivo adjunto
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(1634703)
		.setTimestamp(Date.now())
		.setFooter(footer || { text: '' });
}

module.exports = { messageInfo, messageWarning, messageError, messagePermission, messageSuccess, messageCoupon };
