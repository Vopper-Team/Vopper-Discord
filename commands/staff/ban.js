/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require('discord.js');
const ms = require('ms');

function daysToSeconds(day) {
	return day * 24 * 60 * 60;
}

module.exports = {
	Cooldown: ms('1m'),
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Banea a un usuario.')
		.addUserOption((option) =>
			option
				.setName('usuario')
				.setDescription('El usuario que quieras banear.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('razón').setDescription('Razón del baneo.'),
		)
		.addNumberOption((option) =>
			option
				.setName('duración')
				.setDescription('Selecciona el día de mensajes a borrar.')
				.addChoices(
					{ name: '0 día', value: 0 },
					{ name: '1 día', value: daysToSeconds(1) },
					{ name: '2 días', value: daysToSeconds(2) },
					{ name: '3 días', value: daysToSeconds(3) },
					{ name: '4 días', value: daysToSeconds(4) },
					{ name: '5 días', value: daysToSeconds(5) },
					{ name: '6 días', value: daysToSeconds(6) },
					{ name: '7 días', value: daysToSeconds(7) },
				).setRequired(false),
		),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const userBan = interaction.options.getUser('usuario');
		const reasonBan = interaction.options.getString('razón');
		const member = interaction.guild.members.cache.get(interaction.user.id);

		// Verificar permisos para banear a usuarios
		if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
			return await interaction.reply({
				content: 'No tienes permisos para utilizar este comando!',
				ephemeral: true,
			});
		}

		// Verificar si se proporcionó un usuario a banear
		if (!userBan) {
			return await interaction.reply({
				content: 'Debes mencionar al usuario que quieres banear.',
				ephemeral: true,
			});
		}

		// Obtener el miembro del servidor que se va a banear
		const memberToBan = interaction.guild.members.cache.get(userBan.id);

		// Verificar si el usuario tiene permisos para ser baneado
		if (
			!memberToBan ||
      memberToBan.permissions.has(PermissionFlagsBits.BanMembers)
		) {
			return await interaction.reply({
				content: 'No puedes banear a este usuario.',
				ephemeral: true,
			});
		}
		try {
			// Banear al usuario
			if (!reasonBan) {
				await memberToBan.ban();
				await interaction.reply({ content: `${userBan.tag} ha sido baneado!` });
			}
			await memberToBan.ban({ reason: `${reasonBan}` });
			await interaction.reply({ content: `${userBan.tag} ha sido baneado!` });
		}
		catch (error) {
			return await interaction.reply({
				content: `${error.message}`,
				ephemeral: true,
			});
		}
	},
};
