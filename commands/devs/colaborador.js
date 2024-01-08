// eslint-disable-next-line no-unused-vars
const {
  SlashCommandBuilder,
  Interaction,
  Client,
  EmbedBuilder,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
  ActionRowBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("colaborador")
    .setDescription(
      "Encuentra colaboradores para tu proyecto especificando el lenguaje de programación."
    ),
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("mProyecto")
      .setTitle("Describe tu proyecto");

    // Crear los componentes de entrada de texto
    const titleProyect = new TextInputBuilder()
      .setCustomId("titleInput")
      .setLabel("Título del proyecto")
      .setPlaceholder("Ej. Chatbot")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const descriptionProyect = new TextInputBuilder()
      .setCustomId("descriptionInput")
      .setLabel("¿De qué trata tu proyecto?")
      .setPlaceholder("Ej. Desarrollo de una aplicación de gestión de tareas")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const lenguageProyect = new TextInputBuilder()
      .setCustomId("lenguageInput")
      .setLabel("¿Qué lenguaje de programación se utilizara?")
      .setPlaceholder("Ej. Node.js, C#, Python, Java, entre otros...")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
    const typeCommunication = new TextInputBuilder()
      .setCustomId("typeInput")
      .setLabel("¿Cómo te pueden contactar?")
      .setPlaceholder("Ej. Correo electrónico, Discord, etc.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(titleProyect);
    const secondActionRow = new ActionRowBuilder().addComponents(
      descriptionProyect
    );
    const thirdActionRow = new ActionRowBuilder().addComponents(
      lenguageProyect
    );
    const fourActionRow = new ActionRowBuilder().addComponents(
      typeCommunication
    );

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
