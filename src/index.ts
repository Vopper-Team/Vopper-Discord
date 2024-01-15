import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { config } from 'dotenv';
config();
import { loadEvents } from './utils/loadEvents';
import { loadCommands } from './utils/loadCommands';
import CustomClient from "./interfaces/CustomClient";

const MODE_DEV = process.env.MODE_DEV === 'true';
const token = process.env.TOKEN_BOT;

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildScheduledEvents
];
const partials: Partials[] = [
	Partials.Channel,
	Partials.GuildMember,
	Partials.GuildScheduledEvent,
	Partials.Message,
	Partials.Reaction,
	Partials.ThreadMember,
	Partials.User,
];

const client: CustomClient = new Client({
	intents,
	partials,
  });
  client.menus = new Collection();
  client.commands = new Collection();
  client.events = new Collection();
  client.setMaxListeners(0);client.setMaxListeners(0);


// anticrash
require('./utils/anticrash')

client.login(token)
	.then(async () => {
		await loadEvents(client);
		await loadCommands(client);
	})
	.catch((error: Error) => {
		console.error(error);
	});

module.exports = {MODE_DEV, client};