const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	category: 'Música',
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproducir una canción')
		.addStringOption((option) =>
			option
				.setName('query')
				.setDescription('La palabra clave o URL de la canción a reproducir')
				.setRequired(true),
		),

	/**
   * @param {ChatInputCommandInteraction} interaction
   * @param {*} client
   */
	async execute(interaction, client) {
		try {
			if (!interaction.isCommand()) {
				console.error('Tipo de interacción no válido:', interaction.constructor.name);
				return;
			}

			const palabraClave = interaction.options.getString('query');
			const canalVoz = interaction.member.voice.channel;

			if (!canalVoz) {
				throw new Error('Debes estar en un canal de voz para usar este comando.');
			}

			const cola = await client.distube.getQueue(interaction);

			if (cola && interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId) {
				throw new Error('Debes estar en el mismo canal de voz que el bot.');
			}

			await interaction.reply({
				embeds: [
					new EmbedBuilder().setColor('Default').setDescription('🔍 | Buscando una canción...'),
				],
				ephemeral: true,
			});

			client.distube.play(canalVoz, palabraClave, {
				textChannel: interaction.channel,
				member: interaction.member,
			});

			await interaction.editReply({
				embeds: [new EmbedBuilder().setColor('Green').setDescription('🔍 | Búsqueda exitosa!')],
				ephemeral: true,
			});
		}
		catch (error) {
			console.error(error);

			if (interaction && interaction.followUp) {
				await interaction.followUp({
					content: `Se produjo un error: ${ error.message }`,
					ephemeral: true,
				});
			}
			else {
				console.error('Objeto de interacción no válido:', interaction);
			}
		}
	},
};
