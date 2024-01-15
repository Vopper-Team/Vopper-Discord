import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildScheduledEventManager,
} from "discord.js";
import ms from "ms";

module.exports = {
  Cooldown: ms("10s"),
  data: new SlashCommandBuilder().setName("horarios").setDescription("test"),
  async execute(interaction: ChatInputCommandInteraction, guild: GuildScheduledEventManager) {
    const g = guild.cache.get;
    console.log(g)
  },
};
