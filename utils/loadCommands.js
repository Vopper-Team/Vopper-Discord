/**
 * Load commands into the bot and register them with Discord
 * @param {Client} client
 */
async function loadCommands(client) {
  const AsciiTable = require('ascii-table');
  const fs = require('node:fs');
  const table = new AsciiTable().setHeading('Commands', 'Status');
  await client.commands.clear();

  const commandsArray = [];
  const commandFolder = fs.readdirSync('./commands');

  for (const folder of commandFolder) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const commandFile = require(`../commands/${folder}/${file}`);
        if (commandFile && commandFile.data && commandFile.data.name) {
          const properties = { folder, ...commandFile };
          client.commands.set(commandFile.data.name, properties);
          commandsArray.push(commandFile.data.toJSON());
          table.addRow(file, 'Loaded');
        } else {
          table.addRow(file, 'Error: Missing data.name');
        }
      } catch (error) {
        console.error(`Error loading command from file ${file}: ${error.message}`);
        table.addRow(file, 'Error: Load Failed');
      }
    }
  }

  try {
    client.application.commands.set(commandsArray);
    console.log(table.toString(), '\nLoaded Commands');
  } catch (error) {
    console.error(`Error setting application commands: ${error.message}`);
  }
}

module.exports = { loadCommands };
