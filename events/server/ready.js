// eslint-disable-next-line no-unused-vars
const { ActivityType, Client } = require('discord.js');

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
	},
};
