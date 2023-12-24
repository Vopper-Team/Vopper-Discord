/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js')
const path = require('node:path')
const { messagePermission, messageSuccess } = require(path.join(process.cwd(), '/utils/customMessages.js'))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un usuario.')
    .addUserOption(option =>
      option.setName('usuario').setDescription('El usuario que quieres desbanear.').setRequired(true)
    )
    .addStringOption(option => option.setName('razón').setDescription('Razón del desbaneo.').setRequired(false)),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute (interaction) {
    const userUnban = interaction.options.getUser('usuario')
    const reasonUnban = interaction.options.getString('razón')
    const member = interaction.guild.members.cache.get(interaction.user.id)

    // Verificar permisos para desbanear a usuarios
    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return await interaction.reply({
        embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
        ephemeral: true
      })
    }

    try {
      // Desbanear al usuario
      await interaction.guild.bans.remove(userUnban.id)
      await interaction.reply({
        embeds: [
          messageSuccess(
            'Haz desbaneado a un usuario',
            `Se ha desbaneado al usuario ${userUnban.tag}\nRazón: **${reasonUnban || 'No especificada'}**`
          )
        ],
        ephemeral: true,
        fetchReply: true
      })
    } catch (error) {
      return await interaction.reply({
        content: `${error.message}`,
        ephemeral: true
      })
    }
  }
}
