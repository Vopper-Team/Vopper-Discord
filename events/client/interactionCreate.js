// eslint-disable-next-line no-unused-vars
const {
  Client,
  Interaction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  ModalSubmitFields,
  GuildChannelManager,
  EmbedBuilder,
} = require("discord.js");
const cooldowns = new Map();

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (
      !interaction.guild ||
      !interaction.channel ||
      !(interaction.isChatInputCommand || interaction.isModalSubmit)
    ) {
      return;
    }

    if (interaction.isModalSubmit) {
      // Manejar la interacción del modal submit directamente
      // Puedes colocar la lógica específica del modal submit aquí
      if (interaction.customId === "mProyecto") {
        // Get the data entered by the user
        const title = interaction.fields.getTextInputValue("titleInput");
        const description =
          interaction.fields.getTextInputValue("descriptionInput");
        const type = interaction.fields.getTextInputValue("typeInput");
        const lenguage = interaction.fields.getTextInputValue("lenguageInput");
        const channelColabId = "1186870483489144844";
        const channel = interaction.guild.channels.cache.get(channelColabId);

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
		  .setColor("Green")
          .setAuthor({
            name: "Vopper Community",
            iconURL: `${client.user.avatarURL()}`,
          })
          .addFields(
            {
              name: "Lenguajes a utilizar",
              value: `${lenguage}`,
              inline: false,
            },
            { name: "Contactos", value: `${type}`, inline: false }
          )
          .setFooter({
            text: `Enviado por: ${interaction.user.tag}`,
            iconURL: `${interaction.user.avatarURL()}`,
          });
        try {
          await channel.send({
            embeds: [embed],
            fetchReply: true,
          });
          interaction.reply({
            content: "Tu envío fue recibido exitosamente!",
            ephemeral: true, // Hacer la respuesta visible solo para el usuario
          });
        } catch (error) {
          console.error(error);
          interaction.reply({
            content:
              "Ocurrió un error al procesar tu anuncio. Por favor, intenta nuevamente más tarde.",
            ephemeral: true,
          });
        }
      }
    }

    const command = client.commands.get(interaction.commandName);

    if (command) {
      const cooldownData = cooldowns.get(
        `${interaction.user.id}-${command.name}`
      );

      if (cooldownData && cooldownData.timeout > Date.now()) {
        const timeLeft = Math.ceil((cooldownData.timeout - Date.now()) / 1000);
        return interaction.reply({
          content: `Este comando tiene un tiempo de espera. Tienes que esperar ${timeLeft} segundos para volver a usar`,
          ephemeral: true,
        });
      }

      // Configurar el cooldown
      const cooldownTime = command.Cooldown || 0;
      cooldowns.set(`${interaction.user.id}-${command.name}`, {
        timeout: Date.now() + cooldownTime,
      });

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error("Error al ejecutar el comando:", error);
        return interaction.reply({
          content: "Ocurrió un error al tratar de realizar este comando",
          ephemeral: true,
        });
      }
    } else {
      return interaction.reply({
        content: "Comando no válido",
        ephemeral: true,
      });
    }
  },
};
