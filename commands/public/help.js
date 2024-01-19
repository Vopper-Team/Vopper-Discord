const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  // Setting a cooldown period of 5 seconds for this command
  Cooldown: ms("5s"),
  // Slash command builder for the "help" command
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View list of available bot commands"),

  /**
   * Command to view all available commands of the bot
   * @param {ChatInputCommandInteraction} interaction User interaction with the bot
   * @param {Client} client
   * @returns Send the response to the user
   */
  async execute(interaction, client) {
    // List of commands that can be used by everyone
    const commands = ["coupons", "github", "ping", "suggest", "collab"];
    // List of commands that can be used by staff
    const commandsStaff = ["ban", "kick", "mute", "unban", "unmute"];
    // Create message embed
    const embed = new EmbedBuilder();
    embed.setTitle("Command Guide!");
    embed.setDescription(
      "🚀 Welcome to the Command Guide! Here's the key to unlock all the server's power. Explore and make your experience amazing! 🤖💻"
    );
    embed.addFields(
      {
        name: "🌟 Public",
        value: "List of commands for the user",
        inline: true,
      },
      {
        name: `**${commands[0]}**`,
        value: "*You can send Udemy or any platform coupons.*",
      },
      {
        name: `**${commands[1]}**`,
        value: "*Get information about repositories on GitHub.*",
      },
      { name: `**${commands[2]}**`, value: "*Check the bot's latency.*" },
      {
        name: `**${commands[3]}**`,
        value: "*Submit suggestions to improve the server.*",
      },
      {
        name: `**${commands[4]}**`,
        value: "*Looking for collaborators for your project? Advertise it!*",
      }
    );

    embed.addFields(
      {
        name: "🛠️ Staff",
        value: "Commands exclusive to server staff",
        inline: true,
      },
      {
        name: `**${commandsStaff[0]}**`,
        value: "*Ban a user from the server.*",
      },
      {
        name: `**${commandsStaff[1]}**`,
        value: "*Kick a user from the server.*",
      },
      {
        name: `**${commandsStaff[2]}**`,
        value: "*Mute a user in the chat.*",
      },
      {
        name: `**${commandsStaff[3]}**`,
        value: "*Unban a user.*",
      },
      {
        name: `**${commandsStaff[4]}**`,
        value: "*Unmute a user.*",
      }
    );

    embed.setAuthor({
      name: "Vopper Commands",
      iconURL: `${client.user.avatarURL()}`,
    });
    // Send the message with the embed object
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
