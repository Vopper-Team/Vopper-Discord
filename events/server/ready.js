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
		client.user.setActivity({ name: 'Chambeando', state: 'Chambeando', type: ActivityType.Custom });
	},
};

