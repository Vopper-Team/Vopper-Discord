/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const path = require('node:path');
const { messagePermission, messageSuccess, messageError, messageInfo } = require(path.join(process.cwd(), '/utils/customMessages.js'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Desbanea a un usuario.')
		.addUserOption(option =>
			option.setName('usuario').setDescription('El usuario que quieres desbanear.').setRequired(true),
		),

	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		try {
			const userUnban = interaction.options.getUser('usuario');
			const member = interaction.guild.members.cache.get(interaction.user.id);
			const canalDestinoId = '1187903184207880333';
			const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);
			// Obtener la lista de usuarios baneados en el servidor
			const bans = await interaction.guild.bans.fetch();

			// Verificar si el usuario está en la lista de baneados
			const isBanned = bans.has(userUnban.id);
			// Verificar permisos para desbanear a usuarios
			if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
				return await interaction.reply({
					embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
					ephemeral: true,
				});
			}

			if (!isBanned) {
				return await interaction.reply({
					embeds: [messageError('ERROR!', 'Este usuario no está baneado.')],
					ephemeral: true,
				});
			}

			// Desbanear al usuario
			await interaction.guild.bans.remove(userUnban.id);
			await interaction.reply({
				embeds: [
					messageSuccess(
						'Haz desbaneado a un usuario',
						`Se ha desbaneado al usuario ${ userUnban.tag }.`,
					),
				],
				ephemeral: true,
				fetchReply: true,
			}).then((mensaje) => {
				setTimeout(() => {
					mensaje.delete();
				}, 5000);
			});

			if (canalDestino) {
				// Envía el mensaje al canal de destino
				const logMessage = `${ userUnban.tag } ha sido desbaneado por ${ interaction.member.displayName }.`;
				await canalDestino.send({
					embeds: [messageInfo('¡Se ha desbaneado a un usuario!', logMessage)],
				});
			}
			else {
				console.error('No se pudo encontrar el canal de destino.');
			}
		}
		catch (error) {
			console.log('[UNBAN]', error);
			return await interaction.reply({
				content: `${ error.message }`,
				ephemeral: true,
			});
		}
	},
};
