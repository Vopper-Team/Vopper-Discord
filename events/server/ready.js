const { ActivityType, Client } = require('discord.js');
const path = require('path');
const colors = require('colors');

const MODE_DEV = require('../../index.js');

// ready.js
module.exports = {
  name: 'ready',
  once: true,
  /**
   * Executes when the bot is ready.
   * @param {Client} client
   */
  async execute(client) {
    console.log(`${client.user.username} is active.`);

    if (MODE_DEV) {
      console.log(colors.bgYellow.black.bold('\n====================\n  MODE: DEVELOPMENT  \n===================='));
      client.user.setActivity({
        name: 'Maintenance',
        state: 'Fixing Bugs',
        type: ActivityType.Watching,
      });
    } else {
      console.log(colors.bgGreen.black.bold('\n====================\n  MODE: PRODUCTION  \n===================='));
      const activities = [
        'Working with Sam',
        `${client.user.username}`,
        `${client.guilds.cache.size} servers | ${client.guilds.cache.reduce(
          (a, b) => a + b.memberCount,
          0,
        )} users`,
        `🐛${client.commands.size} commands!`,
      ];
      let i = 0;
      setInterval(() => {
        client.user.setActivity({
          name: `${activities[i++ % activities.length]}`,
          type: ActivityType.Playing,
        });
      }, 5000);
    }
  },
};
