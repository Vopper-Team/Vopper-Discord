const { configDotenv } = require('dotenv');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { loadEvents } = require('./utils/loadEvents');
const { loadCommands } = require('./utils/loadCommands');
configDotenv();
const MODE_DEV = process.env.MODE_DEV === 'true';
const token = process.env.TOKEN_BOT;

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildVoiceStates,
];
const partials = [Partials];
const client = new Client({ intents, partials });
module.exports = client;
client.commands = new Collection();
client.events = new Collection();
client.setMaxListeners(0);

// anticrash
process.on('unhandledRejection', (reason, p) => {
	console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
	console.log(err, origin);
});

client.login(token)
	.then(async () => {
		await loadEvents(client);
		await loadCommands(client);
	})
	.catch((error) => {
		console.error(error);
	});

module.exports = MODE_DEV;