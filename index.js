const { config } = require('dotenv');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
config();
const { loadEvents } = require('./utils/loadEvents');
const { loadCommands } = require('./utils/loadCommands');


const token = process.env.TOKEN_BOT;

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences];
const partials = [Partials];
const client = new Client({ intents, partials });

client.commands = new Collection();
client.events = new Collection();
client.setMaxListeners(0);

client.login(token).then(async () => {
	await loadEvents(client);
	await loadCommands(client);
}).catch((error) => {
	console.log(error);
});