/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

const path = require('node:path');
const { messageInfo, messageError, messagePermission, messageSuccess } = require(path.join(
	process.cwd(),
	'/utils/customMessages.js',
));

async function banUser(memberToBan, reasonBan) {
	if (!reasonBan) {
		await memberToBan.ban();
	}
	else {
		await memberToBan.ban({ reason: reasonBan, deleteMessageSeconds: 0 });
	}
}

async function sendBanConfirmation(interaction, userBan, reasonBan) {
	const successMessage = reasonBan
		? `Se ha baneado el usuario ${ userBan.tag }\nRazón: **${ reasonBan }**`
		: `Se ha baneado al usuario ${ userBan.tag }`;

	await interaction
		.reply({
			embeds: [messageSuccess('Haz baneado a un usuario', successMessage)],
			ephemeral: true,
		})
		.then((mensaje) => {
			setTimeout(
				() => {
					mensaje.delete();
				},
				reasonBan ? 5000 : 15000,
			);
		});
}

async function sendBanLog(canalDestino, interaction, userBan, reasonBan) {
	if (canalDestino) {
		const logMessage = reasonBan
			? `Se ha baneado el usuario ${ userBan.tag }\nRazón: **${ reasonBan }**`
			: `${ userBan.tag } ha sido baneado por ${ interaction.member.displayName }`;

		// Envía el mensaje al canal de destino
		await canalDestino.send({
			embeds: [messageInfo('¡Se ha baneado un usuario!', logMessage)],
		});
	}
	else {
		console.error('No se pudo encontrar el canal de destino.');
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Banea a un usuario.')
		.addUserOption(option =>
			option.setName('usuario').setDescription('El usuario que quieras banear.').setRequired(true),
		)
		.addStringOption(option => option.setName('razón').setDescription('Razón del baneo.').setRequired(false)),

	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		try {
			const userBan = interaction.options.getUser('usuario');
			const reasonBan = interaction.options.getString('razón');
			const member = interaction.guild.members.cache.get(interaction.user.id);
			// Obtener el miembro del servidor que se va a banear
			const memberToBan = interaction.guild.members.cache.get(userBan.id);

			// Canal de log
			const canalDestinoId = '1187903184207880333';
			const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);

			// Verificar permisos para banear a usuarios
			if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
				return await interaction.reply({
					embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
					ephemeral: true,
				});
			}

			// Verificar si se proporcionó un usuario a banear
			if (!userBan) {
				return await interaction.reply({
					embeds: [messageInfo('Te falta algo!', 'Debes mencionar al usuario que quieres banear.')],
					ephemeral: true,
				});
			}

			// Verificar si el usuario tiene permisos para ser baneado
			if (!memberToBan || memberToBan.permissions.has(PermissionFlagsBits.BanMembers)) {
				return await interaction.reply({
					embeds: [messageError('ERROR!', 'No puedes banear a este usuario.')],
					ephemeral: true,
				});
			}
			await banUser(memberToBan, reasonBan);
			await sendBanConfirmation(interaction, userBan, reasonBan);
			await sendBanLog(canalDestino, interaction, userBan, reasonBan);
		}
		catch (error) {
			return await interaction.reply({
				embeds: [messageError('Hubo un error al banear!', `${ error }`)],
				ephemeral: true,
			});
		}
	},
};
