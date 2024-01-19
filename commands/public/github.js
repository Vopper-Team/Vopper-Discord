// eslint-disable-next-line no-unused-vars
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

/**
 * Loads GitHub account information for the given username.
 * @param {string} username - The GitHub username.
 * @returns {Promise<Object>} - The GitHub account information.
 */
async function loadGithubAccount(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const account = await response.json();
  return account;
}

module.exports = {
  // Command cooldown set to 5 seconds
  Cooldown: ms("5s"),

  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Discover someone's GitHub profile! 🚀")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Enter the GitHub username you'd like to explore")
        .setRequired(true)
    ),

  /**
   * Execute function for the "github" command.
   * @param {Client} client - The Discord client instance.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const username = options.getString("username");

    // Check if the username is provided
    if (!username) {
      return await interaction.reply({
        content: "Oops! It seems you forgot to enter a username.",
        ephemeral: true,
      });
    }

    try {
      // Load GitHub account information
      const githubAccount = await loadGithubAccount(username);

      // Parse and format the account creation date
      const createdAtDate = new Date(Date.parse(githubAccount.created_at));
      const formattedDate = createdAtDate.toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });

      // Create an embed with GitHub account information
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Vopper Github",
          iconURL: `${client.user.avatarURL()}`,
        })
        .setTitle(`Account of ${githubAccount.login} :rocket:`)
        .setDescription(githubAccount.bio)
        .setThumbnail(githubAccount.avatar_url)
        .addFields(
          {
            name: "Name :bust_in_silhouette:",
            value: `${githubAccount.name || "N/A"}`,
            inline: true,
          },
          {
            name: "Company :office:",
            value: `${githubAccount.company || "N/A"}`,
            inline: true,
          },
          {
            name: "Location :round_pushpin:",
            value: `${githubAccount.location || "N/A"}`,
            inline: true,
          },
          {
            name: "Website :globe_with_meridians:",
            value: `${githubAccount.blog || "N/A"}`,
            inline: true,
          },
          {
            name: "Public Repositories :file_folder:",
            value: `${githubAccount.public_repos || "N/A"}`,
            inline: true,
          },
          {
            name: "Public Gists :page_facing_up:",
            value: `${githubAccount.public_gists || "N/A"}`,
            inline: true,
          },
          {
            name: "Followers :busts_in_silhouette:",
            value: `${githubAccount.followers || "N/A"}`,
            inline: true,
          },
          {
            name: "Following :footprints:",
            value: `${githubAccount.following || "N/A"}`,
            inline: true,
          },
          { name: "Created at :calendar:", value: formattedDate, inline: true }
        )
        .setFooter({ text: `GitHub Profile of ${username}` })
        .setURL(githubAccount.html_url)
        .setColor("#8510fb");

      // Reply to the user with the embed
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      // Handle errors and inform the user
      return await interaction.reply({
        content: "Couldn't retrieve GitHub information for that user.",
        ephemeral: true,
      });
    }
  },
};
