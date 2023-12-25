const { ActivityType, Client } = require('discord.js');
const path = require('path');
const colors = require('colors');
const MODE_DEV = require(path.join(process.cwd(), '/index.js'));

// ready.js
module.exports = {
	name: 'ready',
	once: true,
	/**
   *
   * @param {Client} client
   */
	async execute(client) {
		console.log(`${client.user.username} está activo.`);

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
				`${client.user.username}`,
				`${
					client.guilds.cache.size
				} servers | ${client.guilds.cache.reduce(
					(a, b) => a + b.memberCount,
					0,
				)} usuarios`,
				`🐛${client.commands.size} comandos!`,
			];
			let i = 0;
			setInterval(
				() =>
					client.user.setActivity({
						name: `${activities[i++ % activities.length]}`,
						type: ActivityType.Playing,
					}),
				5000,
			);
		}
	},
};
