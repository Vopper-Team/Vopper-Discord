/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const {
  SlashCommandBuilder,
  // eslint-disable-next-line no-unused-vars
  ChatInputCommandInteraction,
  PermissionFlagsBits
} = require('discord.js')

const path = require('path')
const { messageInfo, messageError, messagePermission, messageSuccess } = require(path.join(
  process.cwd(),
  '/utils/customMessages.js'
))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutea a un usuario.')
    .addUserOption(option =>
      option.setName('usuario').setDescription('El usuario que quieras mutear.').setRequired(true)
    )
    .addStringOption(option => option.setName('razón').setDescription('Razón de la expulsión.').setRequired(false)),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute (interaction) {
    try {
      const userMute = interaction.options.getUser('usuario')
      const reasonMute = interaction.options.getString('razón')
      const member = interaction.guild.members.cache.get(interaction.user.id)
      const muteRole = await interaction.guild.roles.fetch('1187549277392732202')
      const memberToMute = interaction.guild.members.cache.get(userMute.id)
      const canalDestinoId = '1187903184207880333'
      const canalDestino = interaction.guild.channels.cache.get(canalDestinoId)

      // Verificar permisos del miembro que ejecuta el comando
      if (!member.permissions.has('ManageRoles')) {
        return await interaction.reply({
          embeds: [messagePermission('No tienes permisos!', 'No tienes permisos para utilizar este comando!')],
          ephemeral: true
        })
      }

      // Verificar si se proporcionó un usuario a mutear
      if (!userMute || !memberToMute) {
        return await interaction.reply({
          embeds: [messageInfo('Te falta algo!', 'Debes mencionar al usuario que quieres mutear.')],
          ephemeral: true
        })
      }

      // Verificar si el usuario tiene permisos para ser muteado
      if (memberToMute.permissions.has('ManageRoles')) {
        return await interaction.reply({
          embeds: [messageError('ERROR!', 'No puedes mutear a este usuario.')],
          ephemeral: true
        })
      }

      // Mutear al usuario temporalmente

      // Quitar permisos específicos al rol de mute
      muteRole.permissions.remove(['SendMessages', 'Speak', 'AddReactions'])
      // Asignar el rol de mute al usuario
      await memberToMute.roles.add(muteRole)

      const muteMessage = reasonMute
        ? `Se ha muteado el usuario ${userMute.tag}.\nRazón: **${reasonMute}**.`
        : `Se ha muteado al usuario ${userMute.tag}.`

      await interaction.reply({
        embeds: [messageSuccess('Haz muteado a un usuario', muteMessage)],
        ephemeral: true
      })

      if (canalDestino) {
        // Envía el mensaje al canal de destino
        const logMessage = reasonMute
          ? `${userMute.tag} ha sido muteado por ${interaction.member.displayName}. \nRazón: **${reasonMute}**`
          : `${userMute.tag} ha sido muteado por ${interaction.member.displayName}.`
        await canalDestino.send({
          embeds: [messageInfo('¡Se ha muteado un usuario!', logMessage)]
        })
      } else {
        console.error('No se pudo encontrar el canal de destino.')
      }
    } catch (error) {
      console.log(error)
      await interaction.reply({
        embeds: [messageError('Hubo un error al mutear!', `${error}`)],
        ephemeral: true
      })
    }
  }
}
