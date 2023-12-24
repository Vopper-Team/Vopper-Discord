/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');
const path = require('path');
const {
	messageInfo,
	messageError,
	messageSuccess,
	messageWarning,
	messageCoupon,
} = require(path.join(process.cwd(), '/utils/customMessages.js'));

function capitalizeWords(str) {
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

const parseDate = async (input, interaction) => {
	const regex = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/;
	if (!regex.test(input)) {
		await interaction.reply({
			embeds: [messageError('ERROR en la fecha!', 'Formato de fecha incorrecto. Utiliza: yyyy-mm-dd-hh-mm')],
			ephemeral: true,
		});
		return null;
	}

	const [year, month, day, hour, minute] = input.split('-').map(Number);
	const seconds = 0;
	const fullYear = year < 1000 ? 2000 + year : year;

	const date = new Date(fullYear, month - 1, day, hour, minute, seconds);
	console.log('Inpute', input);
	console.log('Fecha:', date);
	return date.getTime();
};

module.exports = {
	Cooldown: ms('10s'),
	data: new SlashCommandBuilder()
		.setName('cupones')
		.setDescription('Puedes mandar cupones de Udemy o de cualquier plataforma!')
		.addStringOption((option) =>
			option
				.setName('plataforma')
				.setDescription('Selecciona la plataforma que corresponda al cupón')
				.setRequired(true)
				.addChoices({
					name: 'Udemy',
					value: 'udemy',
				}),
		)
		.addStringOption((option) =>
			option
				.setName('código')
				.setDescription('Selecciona la plataforma que corresponda al cupón')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('expiración')
				.setDescription(
					'Fecha de expiración del cupón. Formato: yyyy-mm-dd-hh',
				)
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('url')
				.setDescription('Coloque la url para acceder al curso.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('descripción')
				.setDescription('Agrega una breve descripción de que trata el curso.')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			await interaction.deferReply({ ephemeral: true });

			const { options } = interaction;
			const platformCourse = capitalizeWords(options.getString('plataforma'));
			const codeCourse = options.getString('código');
			const expiryCourse = options.getString('expiración');
			const timestamp = await parseDate(expiryCourse, interaction);
			const formattedTimestamp = Math.floor(timestamp / 1000);
			const urlCourse = options.getString('url');
			const descriptionCourse = options.getString('descripción');

			const memberCurrentChannel = interaction.channel;
			const channelId = '1188175667469226117';
			const channelCoupon = interaction.guild.channels.cache.get(channelId);

			if (timestamp === null || memberCurrentChannel.id !== channelId) {
				await interaction.followUp({
					embeds: [messageWarning('Advertencia!', 'No puedes usar este comando en este canal! \n Solo puedes usarlo en el canal de <#1188175667469226117>')],
					ephemeral: true,
				});
				return;
			}

			const missingArguments = ['plataforma', 'código', 'expiración', 'url', 'descripción']
				.filter(option => !options.getString(option));

			if (missingArguments.length > 0) {
				await interaction.followUp({
					embeds: [messageInfo('Te falta algo!', `Debes proporcionar: ${missingArguments.join(', ')}`)],
					ephemeral: true,
				});
				return;
			}

			await interaction.followUp({
				embeds: [messageSuccess('¡Cupón agregado!', `Se ha agregado el cupón para la plataforma de ${platformCourse}`)],
				ephemeral: true,
			});

			const textDescription = `🎓 **Plataforma:** ${platformCourse}\n🎁**Cupón:** ${codeCourse}\n🕒 **Fecha de expiración:** <t:${formattedTimestamp}:R>\n📚 **Descripción:** ${descriptionCourse}\n Url: ${urlCourse}`;

			if (channelCoupon) {
				await channelCoupon.send({
					embeds: [
						messageCoupon(
							'¡Cupón disponible, aprovechalo!',
							textDescription,
							{ text: `Gracias a ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() },
						),
					],
				});
			}
			else {
				console.error('No se pudo encontrar el canal de destino.');
			}
		}
		catch (error) {
			console.log(error);
			await interaction.followUp({
				embeds: [messageError('Hubo un error al procesar el cupón!', `${error}`)],
				ephemeral: true,
			});
		}
	},
};
