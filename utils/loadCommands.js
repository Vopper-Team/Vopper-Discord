/**
 *
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
		const commandFiles = fs.readdirSync(`./commands/${ folder }`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const commandFile = require(`../commands/${ folder }/${ file }`);
			const properties = { folder, ...commandFile };
			client.commands.set(commandFile.data.name, properties);
			commandsArray.push(commandFile.data.toJSON());
			table.addRow(file, 'Loaded');
			continue;
		}
	}
	client.application.commands.set(commandsArray);
	return console.log(table.toString(), '\nLoaded Commands');
}

module.exports = { loadCommands };
