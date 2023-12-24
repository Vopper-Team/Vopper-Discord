/* eslint-disable no-unused-vars */
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-embed')
    .setDescription('Crea un embed personalizado')
    .addStringOption(option =>
      option.setName('color').setDescription('Elige el color que quieres que tenga el mensaje').addChoices(
        {
          name: 'Default',
          value: 'Default'
        },
        {
          name: 'Blanco',
          value: 'White'
        },
        {
          name: 'Aqua',
          value: 'Aqua'
        },
        {
          name: 'Verde',
          value: 'Green'
        },
        {
          name: 'Azul',
          value: 'Blue'
        },
        {
          name: 'Amarillo',
          value: 'Yellow'
        },
        {
          name: 'Morado',
          value: 'Purple'
        },
        {
          name: 'Random',
          value: 'Random'
        }
      )
    )
    .addStringOption(option => option.setName('título').setDescription('Escribe el texto del mensaje'))
    .addStringOption(option => option.setName('url').setDescription('Ingresa el link').setRequired(false))
    .addStringOption(option =>
      option.setName('descripción').setDescription('Agrega el texto que quieras que salga en el mensaje')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute (interaction) {
    const { options } = interaction
    const color = options.getString('color')
    const titulo = options.getString('título')
    const url = options.getString('url')
    const descripcion = options.getString('descripción')

    const embed = new EmbedBuilder()
    if (color === 'Default') {
      embed.setColor(color)
    } else {
      embed.setColor(color)
    }

    if (titulo) {
      embed.setTitle(titulo)
    }

    if (url) {
      embed.setURL(`${url}`)
    }

    if (descripcion) {
      embed.setDescription(descripcion)
    }
    await interaction.reply({ content: 'Se ha enviado correctamente', ephemeral: true })
    return await interaction.channel.send({ embeds: [embed] })
  }
}
