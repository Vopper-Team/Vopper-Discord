/* eslint-disable no-unused-vars */
const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create a custom embed")
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Choose the color for the message")
        .addChoices(
          { name: "Default", value: "Default" },
          { name: "White", value: "White" },
          { name: "Aqua", value: "Aqua" },
          { name: "Green", value: "Green" },
          { name: "Blue", value: "Blue" },
          { name: "Yellow", value: "Yellow" },
          { name: "Purple", value: "Purple" },
          { name: "Random", value: "Random" }
        )
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("Enter the text for the message")
    )
    .addStringOption((option) =>
      option.setName("url").setDescription("Enter the link").setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Add the text you want to appear in the message")
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.SendMessages
    ),

  /**
   * Execute function for the "embed" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction) {
    const { options, guild } = interaction;
    const color = options.getString("color");
    const title = options.getString("title");
    const url = options.getString("url");
    const description = options.getString("description");

    if (!color || !title || !url || !description) return;
    // Create a new embed
    const embed = new EmbedBuilder();
    embed.setAuthor({ iconURL: guild.iconURL({ dynamic: true }) });
    // Set the color based on user input
    embed.setColor(color);
    // Set the title, URL, and description if provided
    embed.setTitle(title);
    embed.setURL(url);
    // Set the description based on user input
    embed.setDescription(description);
    // Reply to the user and send the embed to the channel
    await interaction.reply({ content: "Sent successfully", ephemeral: true });
    return await interaction.channel.send({ embeds: [embed] });
  },
};
