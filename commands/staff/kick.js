/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require('discord.js');

const path = require('path');
const { messageInfo, messageError, messagePermission, messageSuccess } = require(path.join(process.cwd(), '/utils/customMessages.js'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Expulsa a un usuario.')
		.addUserOption((option) =>
			option
				.setName('usuario')
				.setDescription('El usuario que quieras expulsar.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('razón')
				.setDescription('Razón de la expulsión.'),
		),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const userKick = interaction.options.getUser('usuario');
		const reasonKick = interaction.options.getString('razón');
		const member = interaction.guild.members.cache.get(interaction.user.id);

		// Obtener el miembro del servidor que se va a expulsar
		const memberToKick = interaction.guild.members.cache.get(userKick.id);

		// Canal de log
		const canalDestinoId = '1187903184207880333';
		const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);
		// Verificar permisos para expulsar a usuarios
		if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
			return await interaction.reply({
				embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
				ephemeral: true,
			});
		}

		// Verificar si se proporcionó un usuario a expulsar
		if (!userKick) {
			return await interaction.reply({
				embeds: [messageInfo('Te falta algo!', 'Debes mencionar al usuario que quieres expulsar.')],
				ephemeral: true,
			});
		}

		// Verificar si el usuario tiene permisos para ser expulsado
		if (!memberToKick || memberToKick.permissions.has(PermissionFlagsBits.KickMembers)) {
			return await interaction.reply({
				embeds: [messageError('ERROR!', 'No puedes expulsar a este usuario.')],
				ephemeral: true,
			});
		}

		// Expulsar al usuario
		try {
			if (!reasonKick) {
				await memberToKick.kick();
				await interaction.reply({ embeds: [messageSuccess('Haz expulsado a un usuario', `Se ha expulsado al usuario ${userKick.tag}`)], ephemeral: true });
				if (canalDestino) {
					// Envía el mensaje al canal de destino
					await canalDestino.send({ embeds: [messageInfo('¡Se ha expulsado un usuario!', `${userKick.tag} ha sido baneado por ${interaction.member.displayName}`)] });
				}
				else {
					console.error('No se pudo encontrar el canal de destino.');
				}
			}
			else {
				await memberToKick.kick({ reason: reasonKick });
				await interaction.reply({ embeds: [messageSuccess('Haz expulsado a un usuario', `Se ha expulsado el usuario ${userKick.tag}\nRazón: **${reasonKick}**`)], ephemeral: true });
				if (canalDestino) {
					// Envía el mensaje al canal de destino
					await canalDestino.send({ embeds: [messageInfo('¡Se ha expulsado un usuario!', `${userKick.tag} ha sido baneado por ${interaction.member.displayName}\nRazón: **${reasonKick}**`)] });
				}
				else {
					console.error('No se pudo encontrar el canal de destino.');
				}
			}
		}
		catch (error) {
			return await interaction.reply({
				content: `${error.message}`,
				ephemeral: true,
			});
		}
	},
};
