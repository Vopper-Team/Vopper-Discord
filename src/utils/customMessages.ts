import { EmbedBuilder, EmbedFooterData } from 'discord.js';


function messageInfo(titulo: string, descripcion: string):EmbedBuilder {
	// Devolver el mensaje embed con el archivo adjunto
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(2326507)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1076/1076337.png');
}

function messageWarning(titulo: string, descripcion: string): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(14022154)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1187/1187737.png');
}

function messageError(titulo: string, descripcion: string): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(16058890)
		.setTimestamp(Date.now())
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/9094/9094443.png');
}

function messagePermission(titulo: string, descripcion: string): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(12041422)
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/3558/3558827.png');
}

function messageSuccess(titulo: string, descripcion: string): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(776192)
		.setThumbnail('https://cdn-icons-png.flaticon.com/512/1828/1828644.png');
}

function messageCoupon(titulo: string, descripcion: string, footer: EmbedFooterData): EmbedBuilder{
	// Devolver el mensaje embed con el archivo adjunto
	return new EmbedBuilder()
		.setTitle(titulo)
		.setDescription(descripcion || '')
		.setColor(1634703)
		.setTimestamp(Date.now())
		.setFooter(footer);
}

module.exports = { messageInfo, messageWarning, messageError, messagePermission, messageSuccess, messageCoupon };
