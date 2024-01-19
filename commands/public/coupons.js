const ms = require('ms');
const {SlashCommandBuilder} = require('discord.js');
const { config } = require('../..');
module.exports = {
  // Setting a cooldown period of 5 seconds for this command
  Cooldown: ms("5s"),

  // Slash command builder for the "coupons" command
  data: new SlashCommandBuilder()
    .setName("coupons")
    .setDescription("Send coupons from Udemy or any other platform!")
    .addStringOption((option) =>
      option
        .setName("platform")
        .setDescription("Select the platform that corresponds to the coupon")
        .setRequired(true)
        .addChoices({
          name: "Udemy",
          value: "udemy",
        })
    )
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Coupon code associated with the coupon")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("expire")
        .setDescription("Coupon expiration date. Format: yyyy-mm-dd-hh")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Enter the URL to access the course.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Add a brief description of what the course is about.")
        .setRequired(true)
    ),

  /**
   * Execute function for the "coupons" command.
   * @param {ChatInputCommandInteraction} interaction - The interaction object representing the user's command input.
   * @returns {void}
   */
  async execute(interaction) {
    try {
      // Defer the reply to avoid timeout issues in case of complex processing
      await interaction.deferReply({ ephemeral: true });

      const { options } = interaction;
      const platformCourse = capitalizeWords(options.getString("platform"));
      const codeCourse = options.getString("code");
      const expiryCourse = options.getString("expire");
      const timestamp = await parseDate(expiryCourse, interaction);
      const formattedTimestamp = Math.floor(timestamp / 1000);
      const urlCourse = options.getString("url");
      const descriptionCourse = options.getString("description");

      const memberCurrentChannel = interaction.channel;
      const channelId = config.channels.coupons;
      const channelCoupon = interaction.guild.channels.cache.get(channelId);

      // Check if the command is being used in the correct channel and if the timestamp is valid
      if (timestamp === null || memberCurrentChannel.id !== channelId) {
        await interaction.followUp({
          embeds: [
            messageWarning(
              "Warning!",
              `You can't use this command in this channel!\nYou can only use it in the <#${channelId}> channel.`
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      // Check for missing arguments in the command
      const missingArguments = [
        "platform",
        "code",
        "expire",
        "url",
        "description",
      ].filter((option) => !options.getString(option));

      if (missingArguments.length > 0) {
        await interaction.followUp({
          embeds: [
            messageInfo(
              "Something's missing!",
              `You need to provide: ${missingArguments.join(", ")}`
            ),
          ],
          ephemeral: true,
        });
        return;
      }

      // Respond with success and send the coupon details to the designated coupon channel
      await interaction.followUp({
        embeds: [
          messageSuccess(
            "Coupon Added!",
            `The coupon for the ${platformCourse} platform has been added.`
          ),
        ],
        ephemeral: true,
      });

      // Create a formatted text for the coupon details
      const textDescription = `🎓 **Platform:** ${platformCourse}\n🎁 **Coupon:** ${codeCourse}\n🕒 **Expiration Date:** <t:${formattedTimestamp}:R>\n📚 **Description:** ${descriptionCourse}\n URL: ${urlCourse}`;

      // Send the coupon details to the designated coupon channel
      if (channelCoupon) {
        await channelCoupon.send({
          embeds: [
            messageCoupon("Coupon Available, Grab it Now!", textDescription, {
              text: `Thanks to ${interaction.member.displayName}`,
              iconURL: interaction.member.displayAvatarURL(),
            }),
          ],
        });
      } else {
        console.error("Could not find the destination channel.");
      }
    } catch (error) {
      console.log(error);
      // Handle errors and respond with an error message
      await interaction.followUp({
        embeds: [
          messageError("There was an error processing the coupon!", `${error}`),
        ],
        ephemeral: true,
      });
    }
  },
};
