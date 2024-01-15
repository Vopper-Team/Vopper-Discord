import CustomClient from "../interfaces/CustomClient";
const AsciiTable = require('ascii-table');
import fs from 'node:fs';
export async function loadCommands(client: CustomClient) {

	const table = new AsciiTable().setHeading('Commands', 'Status');
	client.commands?.clear();

	let commandsArray;
	const commandFolder:string[] = fs.readdirSync('./commands');

	for (const folder of commandFolder) {
		const commandFiles = fs.readdirSync(`./commands/${ folder }`).filter((file: string) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const commandFile = require(`../commands/${ folder }/${ file }`);
			const properties = { folder, ...commandFile };
			client.commands?.set(commandFile.data.name, properties);
			commandsArray.push(commandFile.data.toJSON());
			table.addRow(file, 'Loaded');
			continue;
		}
	}
	client.application?.commands.set(commandsArray);
	return console.log(table.toString(), '\nLoaded Commands');
}

module.exports = { loadCommands };
