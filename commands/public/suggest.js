const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const ms = require('ms');
const { config } = require("../..");

module.exports = {
  // Command cooldown set to 10 seconds
  Cooldown: ms("10s"),
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Send a recommendation to the server")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("Enter your suggestion here")
        .setRequired(true)
    ),

  /**
   * Execute function for the "suggest" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   * @param {Client} client - The Discord client instance.
   */
  async execute(interaction, client) {
    // Retrieve the suggestion from user input
    const suggestion = interaction.options.getString("suggestion");
    const { guild, user } = interaction;

    // Define the channel ID for suggestions
    const suggestionsChannelId = config.channels.suggestions;
    const channel = interaction.guild.channels.cache.get(suggestionsChannelId);

    // Check if the suggestion channel is configured correctly
    if (!channel) {
      return interaction.reply({
        content:
          "The suggestion channel is not configured correctly. Contact the server administrator.",
        ephemeral: true,
      });
    }

    // Create an embed for the suggestion
    const embed = new EmbedBuilder()
      .setTitle(`Suggestion from ${user.tag}`)
      .setColor("f5ff00")
      .setDescription(`${suggestion}`)
      .setFooter({
        text: `${guild.name}`,
        iconURL: `${guild.iconURL({ dynamic: true })}`,
      });

    try {
      // Send the suggestion embed to the designated channel
      const message = await channel.send({
        embeds: [embed],
        fetchReply: true,
      });

      // Add reactions to the suggestion message
      await message.react("👍");
      await message.react("👎");

      // Reply to the user indicating successful submission
      interaction.reply({
        content:
          "Your suggestion has been successfully added. Thanks for contributing!",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      // Handle errors and inform the user
      interaction.reply({
        content:
          "An error occurred while processing your suggestion. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
