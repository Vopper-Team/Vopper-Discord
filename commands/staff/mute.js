// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require('discord.js');

const path = require('path');
const buildMessage = require(path.join(
	process.cwd(),
	'utils/customMessages/messageInfo.js',
));

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
		),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const userMute = interaction.options.getUser('usuario');
		const reasonMute = interaction.options.getString('razón');
		const member = interaction.guild.members.cache.get(interaction.user.id);
		const muteRole = interaction.guild.roles.cache.find(
			(role) => role.id === '1187549277392732202',
		);
		// Verificar permisos para mute a usuarios
		if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
			return await interaction.reply({
				content: 'No tienes permisos para utilizar este comando!',
				ephemeral: true,
			});
		}

		// Verificar si se proporcionó un usuario a expulsar
		if (!userMute) {
			return await interaction.reply({
				content: 'Debes mencionar al usuario que quieres mutear.',
				ephemeral: true,
			});
		}

		// Obtener el miembro del servidor que se va a expulsar
		const memberToMute = interaction.guild.members.cache.get(userMute.id);

		// Verificar si el usuario tiene permisos para ser expulsado
		if (
			!memberToMute ||
      memberToMute.permissions.has(PermissionFlagsBits.ManageRoles)
		) {
			return await interaction.reply({
				content: 'No puedes mutear a este usuario.',
				ephemeral: true,
			});
		}

		// Mutear al usuario
		try {
			if (!reasonMute) {
				await memberToMute.roles.add(muteRole);
				await interaction.reply({ content: `Se ha muteado el usuario ${userMute.tag}` });
				const canalDestinoId = '1187903184207880333';
				// Obten el canal de destino
				const canalDestino = interaction.guild.channels.cache.get(canalDestinoId);
				if (canalDestino) {

					const embedObject = buildMessage('¡Se ha muteado un usuario!', `${userMute.tag} ha sido muteado! por ${interaction.member.displayName}`);
					const embed = embedObject.embed;

					// Envía el mensaje al canal de destino
					await canalDestino.send({ embeds: [embed], files: embedObject.files });
				}
				else {
					console.error('No se pudo encontrar el canal de destino.');
				}
			}
		}
		catch (error) {
			console.log(error);
			return await interaction.reply({
				content: `${error}`,
				ephemeral: true,
			});
		}
	},
};
