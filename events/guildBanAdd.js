const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, ban) => {

	const fetchedLogs = await ban.guild.fetchAuditLogs({
		limit: 1,
		type: Discord.AuditLogEvent.MemberBanAdd,
	});

	const banLog = fetchedLogs.entries.first();
  if (!banLog) return;
  const { executor, target } = banLog;
  if (executor.id == client.user.id) return;

  if (target.id === ban.user.id) {

    await client.userData.ensure(`${ban.user.id}`, {
        guildID: ban.guild.id,
        userID: ban.user.id,
        xp: 0,
        level: 0,
        warns: 0,
        bans: 0,
        kicks: 0,
        timeouts: 0,
        note: "None",
        warnings: [],
        totalMessages: 0,
        birthday: null
      });


      let reason;
      if(!fetchedLogs.entries.first().reason) reason = "No reason specified"
      if(fetchedLogs.entries.first().reason) reason = fetchedLogs.entries.first().reason

      const logEmbed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${lang.ModerationEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
      .setColor("Red")
      .addFields([
        { name: `${lang.ModerationEmbedAction}`, value: "``Ban (Discord)``" },
        { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${ban.user.id}>\n\`\`${lang.ModerationEmbedStaff}\`\` <@!${executor.id}>\n\`\`${lang.ModerationEmbedReason}\`\` ${reason}` },
        ])
      .setTimestamp()
      .setFooter({ text: `#${client.guildData.get(`${ban.guild.id}`, `cases`)}`, iconURL: `${ban.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
      let logsChannel = ban.guild.channels.cache.get(config.StaffLogsChannel);

      client.guildData.inc(ban.guild.id, "cases");
      client.userData.inc(`${ban.user.id}`, "bans");
      if (logsChannel) logsChannel.send({ embeds: [logEmbed] })
      }

};