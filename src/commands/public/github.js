// eslint-disable-next-line no-unused-vars
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");
/**
 *
 * @param {string} username
 */
async function loadGithubAccount(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const account = await response.json();
  return account;
}

module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("¡Descubre el perfil GitHub de alguien! 🚀")
    .addStringOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Ingresa el nombre de usuario de GitHub que te gustaría explorar"
        )
        .setRequired(true)
    ),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const username = options.getString("usuario");
    if (!username)
      return await interaction.reply({
        content: "¡Ups! Parece que olvidaste ingresar un nombre de usuario.",
        ephemeral: true,
      });

    try {
      const githubAccount = await loadGithubAccount(username);
      // Parsear la fecha
      const createdAtDate = new Date(Date.parse(githubAccount.created_at));

      // Formatear la fecha a un formato legible
      const formattedDate = createdAtDate.toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Vopper Github",
          iconURL: `${client.user.avatarURL()}`,
        })
        .setTitle(`Cuenta de ${githubAccount.login} :rocket:`)
        .setDescription(githubAccount.bio)
        .setThumbnail(githubAccount.avatar_url)
        .addFields(
          {
            name: "Nombre :bust_in_silhouette:",
            value: `${githubAccount.name || "N/A"}`,
            inline: true,
          },
          {
            name: "Empresa :office:",
            value: `${githubAccount.company || "N/A"}`,
            inline: true,
          },
          {
            name: "Ubicación :round_pushpin:",
            value: `${githubAccount.location || "N/A"}`,
            inline: true,
          },
          {
            name: "Sitio web :globe_with_meridians:",
            value: `${githubAccount.blog || "N/A"}`,
            inline: true,
          },
          {
            name: "Repositorios públicos :file_folder:",
            value: `${githubAccount.public_repos || "N/A"}`,
            inline: true,
          },
          {
            name: "Gists públicos :page_facing_up:",
            value: `${githubAccount.public_gists || "N/A"}`,
            inline: true,
          },
          {
            name: "Seguidores :busts_in_silhouette:",
            value: `${githubAccount.followers || "N/A"}`,
            inline: true,
          },
          {
            name: "Siguiendo :footprints:",
            value: `${githubAccount.following || "N/A"}`,
            inline: true,
          },
          { name: "Creada en :calendar:", value: formattedDate, inline: true }
        )
        .setFooter({ text: `Perfil de GitHub de ${username}` })
        .setURL(githubAccount.html_url)
        .setColor("#8510fb");

      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return await interaction.reply({
        content:
          "No se pudo obtener la información de Github para ese usuario.",
        ephemeral: true,
      });
    }
  },
};
