// Load environment variables from .env file
const { configDotenv } = require("dotenv");
configDotenv();

// Load configuration from config.json
const config = require('./config.json');

// Discord.js imports
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

// Utility functions to load events and commands
const { loadEvents } = require("./utils/loadEvents");
const { loadCommands } = require("./utils/loadCommands");

// Check if the bot is running in development mode
const MODE_DEV = process.env.MODE_DEV === "true";

// Discord bot token from environment variables
const token = process.env.TOKEN_BOT;

// Define necessary intents and partials for the Discord.js client
const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildScheduledEvents,
];
const partials = [
  Partials.GuildScheduledEvent,
  Partials.Channel,
  Partials.GuildMember,
  Partials.Message,
  Partials.Reaction,
  Partials.ThreadMember,
  Partials.User,
];

// Create a new instance of the Discord.js client
const client = new Client({ intents, partials });

// Create Collections to store buttons, menus, commands, and events
client.buttons = new Collection();
client.menus = new Collection();
client.commands = new Collection();
client.events = new Collection();

// Set the maximum number of listeners to avoid warnings
client.setMaxListeners(0);

// Load anticrash utility
require('./utils/anticrash.js');

// Login to Discord with the provided token
client
  .login(token)
  .then(async () => {
    // Load events and commands after successful login
    await loadEvents(client);
    await loadCommands(client);
  })
  .catch((error) => {
    // Log any login errors
    console.error(error);
  });

// Export relevant variables for external use
module.exports = { MODE_DEV, config, client };
