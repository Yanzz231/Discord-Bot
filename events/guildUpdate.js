const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, oldGuild, newGuild) => {
    if(config.GuildUpdateLogs.Enabled === false) return;

    if (oldGuild.name !== newGuild.name) {
        if(!newGuild.me.permissions.has("ViewAuditLogs")) return;

        var serverIcon = newGuild.iconURL();
        const fetchedLogs = await newGuild.fetchAuditLogs({
            limit: 1,
            type: "GUILD_UPDATE",
        });
        const guildUpdateLog = fetchedLogs.entries.first();
        if (!guildUpdateLog) return console.log(`A guild name was changed, but no relevant audit logs were found.`);
        const { executor, target } = guildUpdateLog;

        var embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setThumbnail(serverIcon)
        .setTitle(`**${lang.GuildNameUpdateEmbedTitle}**`)
        .setDescription(`**${lang.GuildNameUpdateEmbed}** ${executor}`)
        .addFields([
            { name: `${lang.GuildNameUpdateOld}`, value: `${oldGuild}` },
            { name: `${lang.GuildNameUpdateNew}`, value: `${newGuild}` },
            ])

        let guildNameLog = newGuild.channels.cache.get(config.GuildUpdateLogs.ChannelID);
        if (guildNameLog) return guildNameLog.send({ embeds: [embed] })
    }
};
