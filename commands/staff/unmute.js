/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require('discord.js');

const path = require('path');
const { messageInfo, messageError, messagePermission, messageSuccess } = require(path.join(
	process.cwd(),
	'/utils/customMessages.js',
));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Desmutea a un usuario.')
		.addUserOption(option =>
			option.setName('usuario').setDescription('El usuario que quieras desmutear.').setRequired(true),
		),

	/**
		 *
		 * @param {ChatInputCommandInteraction} interaction
		 * @returns
		 */
	async execute(interaction) {
		try {
			const userUnmute = interaction.options.getUser('usuario');
			const member = interaction.guild.members.cache.get(interaction.user.id);
			const muteRole = await interaction.guild.roles.fetch('1187549277392732202');
			const memberToUnmute = await interaction.guild.members.fetch(userUnmute.id).catch(() => null);
			const canalDestinoId = '1187903184207880333';
			const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);

			// Verificar permisos del miembro que ejecuta el comando
			if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
				return await interaction.reply({
					embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
					ephemeral: true,
				});
			}

			// Verificar si se proporcionó un usuario a desmutear
			if (!userUnmute) {
				return await interaction.reply({
					embeds: [messageInfo('Te falta algo!', 'Debes mencionar al usuario que quieres desmutear.')],
					ephemeral: true,
				});
			}

			// Desmutea al usuario
			if (memberToUnmute) {
				await memberToUnmute.roles.remove(muteRole);
				await interaction.reply({
					embeds: [messageSuccess('Haz desmuteado a un usuario', `Se ha desmuteado al usuario ${ userUnmute.tag }.`)],
					ephemeral: true,
				}).then((mensaje) => {
					setTimeout(() => {
						mensaje.delete();
					}, 5000);
				});

				if (canalDestino) {
				// Envía el mensaje al canal de destino
					await canalDestino.send({
						embeds: [
							messageInfo(
								'¡Se ha desmuteado a un usuario!',
								`${ userUnmute.tag } ha sido desmuteado por ${ interaction.member.displayName }.`,
							),
						],
					});
				}
				else {
					console.error('No se pudo encontrar el canal de destino.');
				}
			}
			else {
				console.error('No se pudo encontrar al usuario para mutear.');
				return await interaction.reply({
					embeds: [messageError('ERROR!', 'No se pudo encontrar al usuario para mutear.')],
					ephemeral: true,
				});
			}
		}
		catch (error) {
			console.log('[MUTE]', error);
			await interaction.reply({
				embeds: [messageError('Hubo un error al desmutear!', `${ error }`)],
				ephemeral: true,
			});
		}
	},
};
