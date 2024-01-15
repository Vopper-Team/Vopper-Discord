const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sugerencia')
		.setDescription('Envía alguna recomendación al servidor')
		.addStringOption((option) =>
			option
				.setName('sugerencia')
				.setDescription('Escribe aquí tu sugerencia')
				.setRequired(true),
		),
	/**
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction, client) {
		const sugerencia = interaction.options.getString('sugerencia');
		const { guild, user } = interaction;

		const canalDeSugerenciasId = '1186505483255824465';
		const channel = interaction.guild.channels.cache.get(canalDeSugerenciasId);

		if (!channel) {
			return interaction.reply({
				content: 'El canal de sugerencias no está configurado correctamente. Contacta al administrador del servidor.',
				ephemeral: true,
			});
		}

		const embed = new EmbedBuilder()
			.setTitle(`Sugerencia de ${ user.tag }`)
			.setColor('f5ff00')
			.setDescription(`${ sugerencia }`)
			.setFooter({
				text: `${ guild.name }`,
				iconURL: `${ guild.iconURL({ dynamic: true }) }`,
			});

		try {
			const message = await channel.send({
				embeds: [embed],
				fetchReply: true,
			});

			await message.react('👍');
			await message.react('👎');

			interaction.reply({
				content: 'Tu sugerencia fue agregada con éxito. ¡Gracias por contribuir!',
				ephemeral: true,
			});
		}
		catch (error) {
			console.error(error);
			interaction.reply({
				content: 'Ocurrió un error al procesar tu sugerencia. Por favor, intenta nuevamente más tarde.',
				ephemeral: true,
			});
		}
	},
};
