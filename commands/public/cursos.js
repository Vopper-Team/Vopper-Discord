/* eslint-disable no-unused-vars */
const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  Cooldown: ms("20s"),
  data: new SlashCommandBuilder()
    .setName("cursos")
    .setDescription("Todos los cursos!")
    .addSubcommandGroup((group) =>
      group
        .setName("frontend")
        .setDescription("Cosas de frontend")
        .addSubcommand((sc) =>
          sc.setName("react").setDescription("Cursos de React!")
        )
        .addSubcommand((sc) =>
          sc.setName("angular").setDescription("Cursos de Angular!")
        )
        .addSubcommand((sc) =>
          sc.setName("html").setDescription("Cursos de Html!")
        )
        .addSubcommand((sc) =>
          sc.setName("css").setDescription("Cursos de CSS!")
        )
        .addSubcommand((sc) =>
          sc.setName("javascript").setDescription("Cursos de JavaScript!")
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("backend")
        .setDescription("Cosas del backend")
        .addSubcommand((sc) =>
          sc.setName("java").setDescription("Cursos de Java!")
        )
        .addSubcommand((sc) =>
          sc.setName("c").setDescription("Cursos de C#!")
        )
        .addSubcommand((sc) =>
          sc.setName("node.js").setDescription("Cursos de Node.js!")
        )
        .addSubcommand((sc) =>
          sc.setName("python").setDescription("Cursos de Python!")
        )
        .addSubcommand((sc) =>
          sc.setName("c").setDescription("Cursos de C!")
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {},
};
