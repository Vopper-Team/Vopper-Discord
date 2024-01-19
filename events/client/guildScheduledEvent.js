const { GuildScheduledEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildScheduledEventCreate",
  once: false,
  /**
   * Executes when a new guild scheduled event is created.
   *
   * @param {GuildScheduledEvent} event - The guild scheduled event object.
   * @returns {Promise<void>} - A Promise that resolves after the execution.
   */
  async execute(event) {
    // Check if the event or event name is not defined
    if (!event || !event.name) {
      console.error("Event or event name not defined.");
      return;
    }

    // Convert the event title to lowercase for a more flexible comparison
    const lowerCaseTitle = event.name.toLowerCase();

    // Check if the event title includes "curso" or "cursos"
    if (
      !lowerCaseTitle.includes("curso") &&
      !lowerCaseTitle.includes("cursos")
    ) {
      return;
    }

    // ID of the channel where the notification will be sent
    const channelId = "1186870483489144844";

    // Check if the server has the channel
    if (event.guild.channels.cache.has(channelId)) {
      // Event details
      const titleEvent = event.name;
      const decriptionEvent = event.description;
      const channelEvent = event.channel;
      const dateEvent = event.scheduledStartAt.getDate();
      const creatorEvent = event.creator;

      // Create an message Embed
      const embed = new EmbedBuilder();
      embed.setAuthor({
        name: "Vopper Clases",
        iconURL: `${event.client.user.avatarURL()}`,
      });
      embed.setTitle(`Nueva Clase: ${titleEvent}`);
      embed.setDescription(decriptionEvent);
      embed.setColor("#3498db");
      embed.addFields(
        { name: "Canal del Evento", value: `${channelEvent}`, inline: true },
        {
          name: "Hora del Evento",
          value: `<t:${dateEvent}:R>`,
          inline: true,
        },
        { name: "Creador del Evento", value: `${creatorEvent}`, inline: true }
      );

      const rolMessage = `¡@everyone! Hay una nueva clase: ${titleEvent}. ¡No te la pierdas!`;
      // Send message Embed to Channel Notifications
      const channelNotification = event.guild.channels.cache.get(channelId);
      await channelNotification.send({ content: rolMessage, embeds: [embed] });
    }
  },
};
