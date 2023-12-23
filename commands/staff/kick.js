/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require('discord.js');
const ms = require('ms');

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
		.addStringOption((op) =>
			op.setName('razón').setDescription('Razón de la expulsión.'),
		),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const userKick = interaction.options.getUser('usuario');
		const reasonKick = interaction.options.getString('razón');
		const member = interaction.guild.members.cache.get(interaction.user.id);

		// Verificar permisos para expulsar a usuarios
		if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
			return await interaction.reply({
				content: 'No tienes permisos para utilizar este comando!',
				ephemeral: true,
			});
		}

		// Verificar si se proporcionó un usuario a expulsar
		if (!userKick) {
			return await interaction.reply({
				content: 'Debes mencionar al usuario que quieres expulsar.',
				ephemeral: true,
			});
		}

		// Obtener el miembro del servidor que se va a expulsar
		const memberToKick = interaction.guild.members.cache.get(userKick.id);

		// Verificar si el usuario tiene permisos para ser expulsado
		if (
			!memberToKick ||
      memberToKick.permissions.has(PermissionFlagsBits.KickMembers)
		) {
			return await interaction.reply({
				content: 'No puedes expulsar a este usuario.',
				ephemeral: true,
			});
		}

		// Expulsar al usuario
		try {
			if (!reasonKick) {
				await memberToKick.kick();
				await interaction.reply({
					content: `${userKick.tag} ha sido expulsado!`,
				});
			}
			else {
				await memberToKick.kick(reasonKick);
				await interaction.reply({ content: `${userKick.tag} ha sido expulsado!` });
			}

		}
		catch (error) {
			await interaction.reply({
				content: `${error.message}`,
				ephemeral: true,
			});
		}
	},
};
