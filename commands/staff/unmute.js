/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require('discord.js');

const path = require('path');
const {
	messageInfo,
	messageError,
	messagePermission,
	messageSuccess,
} = require(path.join(process.cwd(), '/utils/customMessages.js'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Desmutea a un usuario.')
		.addUserOption((option) =>
			option
				.setName('usuario')
				.setDescription('El usuario que quieras desmutear.')
				.setRequired(true),
		),
	async execute(interaction) {
		try {
			const userUnmute = interaction.options.getUser('usuario');
			const member = interaction.guild.members.cache.get(interaction.user.id);
			const muteRole = await interaction.guild.roles.fetch(
				'1187549277392732202',
			);
			const memberToUnmute = interaction.guild.members.cache.get(userUnmute.id);
			const canalDestinoId = '1187903184207880333';
			const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);

			// Verificar permisos del miembro que ejecuta el comando
			if (!member.permissions.has('ManageRoles')) {
				return await interaction.reply({
					embeds: [
						messagePermission(
							'No tienes permisos!',
							'No tienes permisos para utilizar este comando!',
						),
					],
					ephemeral: true,
				});
			}

			// Verificar si se proporcionó un usuario a desmutear
			if (!userUnmute || !memberToUnmute) {
				return await interaction.reply({
					embeds: [
						messageInfo(
							'Te falta algo!',
							'Debes mencionar al usuario que quieres desmutear.',
						),
					],
					ephemeral: true,
				});
			}

			// Verificar si el usuario tiene el rol de mute
			if (!memberToUnmute.roles.cache.has(muteRole.id)) {
				return await interaction.reply({
					embeds: [messageError('ERROR!', 'Este usuario no está muteado.')],
					ephemeral: true,
				});
			}

			// Desmutear al usuario
			await memberToUnmute.roles.remove(muteRole);
			await interaction.reply({
				embeds: [
					messageSuccess(
						'Haz desmuteado a un usuario',
						`Se ha desmuteado al usuario ${userUnmute.tag}.`,
					),
				],
				ephemeral: true,
			});

			if (canalDestino) {
				// Envía el mensaje al canal de destino
				await canalDestino.send({
					embeds: [
						messageInfo(
							'¡Se ha desmuteado a un usuario!',
							`${userUnmute.tag} ha sido desmuteado por ${interaction.member.displayName}.`,
						),
					],
				});
			}
			else {
				console.error('No se pudo encontrar el canal de destino.');
			}
		}
		catch (error) {
			console.log(error);
			await interaction.reply({
				embeds: [messageError('Hubo un error al desmutear!', `${error}`)],
				ephemeral: true,
			});
		}
	},
};
