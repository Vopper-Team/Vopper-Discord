const { Client, Interaction, EmbedBuilder } = require("discord.js");
// Map to store command cooldowns
const cooldowns = new Map();

module.exports = {
  // Event name for when an interaction is created
  name: "interactionCreate",
  // Whether the event should only be executed once
  once: false,

  /**
   * Handles the interaction creation event.
   * @param {Interaction} interaction - The Discord interaction object.
   * @param {Client} client - The Discord client instance.
   */
  async execute(interaction, client) {
    // Check if the interaction is relevant for processing (guild, channel, and type check)
    if (
      !interaction.guild ||
      !interaction.channel ||
      !isValidInteractionType(interaction)
    ) {
      return;
    }

    // Handling modal submit interaction separately
    if (interaction.isModalSubmit && interaction.customId === "mProyecto") {
      handleModalSubmit(interaction, client);
      return;
    }

    // Check if the interaction corresponds to a registered command
    const command = client.commands.get(interaction.commandName);

    if (command) {
      handleCommandInteraction(command, interaction, client);
    } else {
      // Respond to the user if the command is not valid
      invalidCommandResponse(interaction);
    }
  },
};

/**
 * Checks if the interaction type is valid for processing.
 * @param {Interaction} interaction - The Discord interaction object.
 * @returns {boolean} - True if the interaction type is valid, otherwise false.
 */
function isValidInteractionType(interaction) {
  return interaction.isChatInputCommand || interaction.isModalSubmit;
}

/**
 * Handles the logic for modal submit interactions.
 * @param {Interaction} interaction - The Discord interaction object.
 * @param {Client} client - The Discord client instance.
 */
async function handleModalSubmit(interaction, client) {
  const channelColabId = "1193754035837222922";
  const channel = interaction.guild.channels.cache.get(channelColabId);

  // Get the data entered by the user
  const title = interaction.fields.getTextInputValue("titleInput");
  const description = interaction.fields.getTextInputValue("descriptionInput");
  const type = interaction.fields.getTextInputValue("typeInput");
  const language = interaction.fields.getTextInputValue("lenguageInput");

  // Build an embed with the submitted data
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("GREEN") // Use uppercase for color names
    .setAuthor({
      name: "Vopper Community",
      iconURL: client.user.avatarURL(),
    })
    .addFields(
      { name: "Languages to use", value: language, inline: false },
      { name: "Contacts", value: type, inline: false }
    )
    .setFooter({
      text: `Submitted by: ${interaction.user.tag}`,
      iconURL: interaction.user.avatarURL(),
    });

  try {
    // Send the embed to the designated channel
    await channel.send({ embeds: [embed], fetchReply: true });

    // Respond to the user indicating successful submission
    interaction.reply({
      content: "Your submission has been received successfully!",
      ephemeral: true, // Make the response visible only to the user
    });
  } catch (error) {
    console.error(error);
    // Handle errors and inform the user
    interaction.reply({
      content:
        "An error occurred while processing your announcement. Please try again later.",
      ephemeral: true,
    });
  }
}

/**
 * Handles the logic for command interactions.
 * @param {Object} command - The command object.
 * @param {Interaction} interaction - The Discord interaction object.
 * @param {Client} client The instancie bot client 
 */
async function handleCommandInteraction(command, interaction, client) {
  // Check for command cooldowns
  const cooldownData = cooldowns.get(`${interaction.user.id}-${command.name}`);

  if (cooldownData && cooldownData.timeout > Date.now()) {
    const timeLeft = Math.ceil((cooldownData.timeout - Date.now()) / 1000);
    return interaction.reply({
      content: `This command has a cooldown. You need to wait ${timeLeft} seconds before using it again.`,
      ephemeral: true,
    });
  }

  // Set up the cooldown
  const cooldownTime = command.Cooldown || 0;
  cooldowns.set(`${interaction.user.id}-${command.name}`, {
    timeout: Date.now() + cooldownTime,
  });

  try {
    // Execute the command
    await command.execute(interaction, client);
  } catch (error) {
    console.error("Error executing the command:", error);
    // Handle errors and inform the user
    return interaction.reply({
      content: "An error occurred while trying to execute this command",
      ephemeral: true,
    });
  }
}

/**
 * Responds to the user when the command is not valid.
 * @param {Interaction} interaction - The Discord interaction object.
 */
function invalidCommandResponse(interaction) {
  interaction.reply({
    content: "Invalid command",
    ephemeral: true,
  });
}
