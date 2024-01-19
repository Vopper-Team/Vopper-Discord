const {
  SlashCommandBuilder,
  Interaction,
  Client,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
  ActionRowBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  // Cooldown set to 5 seconds
  Cooldown: ms("5s"),

  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("collab")
    .setDescription(
      "Find collaborators for your project by specifying the programming language."
    ),

  /**
   * Execute function for the "collaborator" command.
   * @param {Client} client - The Discord client instance.
   * @param {Interaction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction) {
    // Create a modal for project description
    const projectModal = new ModalBuilder()
      .setCustomId("mProject")
      .setTitle("Describe your project");

    // Create text input components for project details
    const titleInput = new TextInputBuilder()
      .setCustomId("titleInput")
      .setLabel("Project Title")
      .setPlaceholder("E.g., Chatbot")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("descriptionInput")
      .setLabel("Project Description")
      .setPlaceholder("E.g., Development of a task management application")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const languageInput = new TextInputBuilder()
      .setCustomId("languageInput")
      .setLabel("Programming Language(s)")
      .setPlaceholder("E.g., Node.js, C#, Python, Java, etc.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const contactInput = new TextInputBuilder()
      .setCustomId("contactInput")
      .setLabel("Contact Information")
      .setPlaceholder("E.g., Email, Discord, etc.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    // Create action rows with text input components
    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
    const secondActionRow = new ActionRowBuilder().addComponents(
      descriptionInput
    );
    const thirdActionRow = new ActionRowBuilder().addComponents(languageInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(contactInput);

    // Add text input components to the modal
    projectModal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow
    );

    // Show the modal to the user
    await interaction.showModal(projectModal);
  },
};
