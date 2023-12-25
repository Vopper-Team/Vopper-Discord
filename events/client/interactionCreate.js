// eslint-disable-next-line no-unused-vars
const { Client, ChatInputCommandInteraction } = require('discord.js');
const cooldowns = new Map();

module.exports = {
	name: 'interactionCreate',
	once: false,
	/**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
	async execute(interaction, client) {
		if (!interaction.guild || !interaction.channel || !interaction.isChatInputCommand) return;

		const command = client.commands.get(interaction.commandName);

		if (command) {
			const cooldownData = cooldowns.get(`${interaction.user.id}-${command.name}`);

			if (cooldownData && cooldownData.timeout > Date.now()) {
				const timeLeft = Math.ceil((cooldownData.timeout - Date.now()) / 1000);
				return interaction.reply({
					content: `Este comando tiene un tiempo de espera. Tienes que esperar ${timeLeft} segundos para volver a usar`,
					ephemeral: true,
				});
			}

			// Configurar el cooldown
			const cooldownTime = command.Cooldown || 0;
			cooldowns.set(`${interaction.user.id}-${command.name}`, {
				timeout: Date.now() + cooldownTime,
			});

			try {
				await command.execute(interaction, client);
			}
			catch (error) {
				console.error('Error al ejecutar el comando:', error);
				return interaction.reply({
					content: 'Ocurrió un error al tratar de realizar este comando',
					ephemeral: true,
				});
			}
		}
		else {
			return interaction.reply({
				content: 'Comando no válido',
				ephemeral: true,
			});
		}
	},
};
