// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	PermissionFlagsBits,

} = require('discord.js');

const path = require('path');
const { messageInfo, messageError, messagePermission, messageSuccess } = require(path.join(process.cwd(), '/utils/customMessages.js'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutea a un usuario.')
		.addUserOption((option) =>
			option
				.setName('usuario')
				.setDescription('El usuario que quieras mutear.')
				.setRequired(true),
		)
		.addStringOption((op) =>
			op.setName('razón').setDescription('Razón de la expulsión.'),
		).setRequired(false),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const userMute = interaction.options.getUser('usuario');
		const reasonMute = interaction.options.getString('razón');
		const member = interaction.guild.members.cache.get(interaction.user.id);
		const muteRole = interaction.guild.roles.cache.find((role) => role.id === '1187549277392732202');
		// Obtener el miembro del servidor que se va a expulsar
		const memberToMute = interaction.guild.members.cache.get(userMute.id);
		// Canal de log
		const canalDestinoId = '1187903184207880333';
		const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);

		// Verificar permisos para mute a usuarios
		if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
			return await interaction.reply({
				embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
				ephemeral: true,
			});
		}

		// Verificar si se proporcionó un usuario a expulsar
		if (!userMute) {
			return await interaction.reply({
				embeds: [messageInfo('Te falta algo!', 'Debes mencionar al usuario que quieres mutear.')],
				ephemeral: true,
			});
		}

		// Verificar si el usuario tiene permisos para ser expulsado
		if (!memberToMute || memberToMute.permissions.has(PermissionFlagsBits.ManageRoles)) {
			return await interaction.reply({
				embeds: [messageError('ERROR!', 'No puedes mutear a este usuario.')],
				ephemeral: true,
			});
		}

		// Mutear al usuario temporalmente
		try {
			if (!reasonMute) {
				await memberToMute.roles.add(muteRole);
				await interaction.reply({ embeds: [messageSuccess('Haz muteado a un usuario', `Se ha muteado al usuario ${userMute.tag}.`)], ephemeral: true });
				if (canalDestino) {
					// Envía el mensaje al canal de destino
					await canalDestino.send({ embeds: [messageInfo('¡Se ha muteado a un usuario!', `${userMute.tag} ha sido muteado por ${interaction.member.displayName()}.`)] });
				}
				else {
					console.error('No se pudo encontrar el canal de destino.');
				}
			}
			else {
				await memberToMute.roles.add(muteRole);
				await interaction.reply({ embeds: [messageSuccess('Haz muteado a un usuario', `Se ha muteado el usuario ${userMute.tag}. \nRazón: **${reasonMute}**.`)], ephemeral: true });

				if (canalDestino) {
					// Envía el mensaje al canal de destino
					await canalDestino.send({ embeds: [messageInfo('¡Se ha muteado un usuario!', `${userMute.tag} ha sido muteado por ${interaction.member.displayName}. \nRazón: **${reasonMute}**`)] });
				}
				else {
					console.error('No se pudo encontrar el canal de destino.');
				}
			}
		}
		catch (error) {
			console.log(error);
			await interaction.reply({
				embeds: [messageError('Hubo un error al mutear!', `${error}`)],
				ephemeral: true,
			});
		}
	},
};
