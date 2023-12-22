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
		client.user.setActivity({ name: 'Hiram.dev', type: ActivityType.Watching, url: 'https://www.tiktok.com/@hiram.dev?_t=8iLjLpdtSpZ&_r=1' });
	},
};

