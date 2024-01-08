const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { loadCommands } = require(path.join(process.cwd(), '/utils/loadCommands.js')); // Asegúrate de proporcionar la ruta correcta

module.exports = {
	category: 'utilidad',
	data: new SlashCommandBuilder()
		.setName('recargar')
		.setDescription('Recarga todos los comandos o un comando específico.')
		.addStringOption(option =>
			option.setName('comando')
				.setDescription('El comando que se recargará. Deja en blanco para recargar todos los comandos.')
				.setRequired(false)),
	async execute(interaction, client) {
		const commandName = interaction.options.getString('comando', false);
		let replyMessage = '';

		if (commandName) {
			// Recargar comando específico
			const command = client.commands.get(commandName.toLowerCase());

			if (!command) {
				replyMessage = `¡No hay ningún comando con el nombre \`${ commandName }\`!`;
			}
			else {
				delete require.cache[require.resolve(`../${ command.folder }/${ command.data.name }.js`)];

				try {
					client.commands.delete(command.data.name);
					const newCommand = require(`../${ command.folder }/${ command.data.name }.js`);
					client.commands.set(newCommand.data.name, { folder: command.folder, ...newCommand });
					replyMessage = `¡El comando \`${ newCommand.data.name }\` ha sido recargado!`;
				}
				catch (error) {
					console.error(error);
					replyMessage = `Hubo un error al recargar el comando \`${ command.data.name }\`:\n\`${ error.message }\``;
				}
			}
		}
		else {
			// Recargar todos los comandos
			await loadCommands(client);
			replyMessage = '¡Todos los comandos han sido recargados!';
		}

		await interaction.reply(replyMessage || '¡No se proporcionó un comando para recargar!');
	},
};
