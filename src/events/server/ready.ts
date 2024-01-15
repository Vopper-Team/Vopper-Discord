/* eslint-disable no-unused-vars */
import { ActivityType, Client } from 'discord.js';
import path from 'path';
import colors from 'colors';
import CustomClient from '../../interfaces/CustomClient';
const MODE_DEV = require(path.join(process.cwd(), '/index.js'));

// ready.js
module.exports = {
	name: 'ready',
	once: true,

	async execute(client: CustomClient) {
		console.log(`${ client.user.username } está activo.`);

		if (MODE_DEV == true) {
			console.log(colors.bgYellow.black.bold('\n====================\n  MODO: DESARROLLO  \n===================='));
			client.user.setActivity({
				name: 'Mantenimiento',
				state: 'Arreglando Bugs',
				type: ActivityType.Watching,
			});
		}
		else {
			console.log(colors.bgGreen.black.bold('\n====================\n  MODO: PRODUCCIÓN  \n===================='));
			const activities = [
				'Chambeando con Sam',
				`${ client.user.username }`,
				`${
					client.guilds.cache.size
				} servers | ${ client.guilds.cache.reduce(
					(a, b) => a + b.memberCount,
					0,
				) } usuarios`,
				`🐛${ client.commands.size } comandos!`,
			];
			let i = 0;
			setInterval(
				() =>
					client.user.setActivity({
						name: `${ activities[i++ % activities.length] }`,
						type: ActivityType.Playing,
					}),
				5000,
			);
		}
	},
};
