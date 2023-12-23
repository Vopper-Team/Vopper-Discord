// messageAlert.js

const { EmbedBuilder } = require('discord.js');

function buildMessage(titulo, descripcion) {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion)
		.setColor('d5f60a')
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1187/1187737.png');
}

module.exports = {
	buildMessage,
};