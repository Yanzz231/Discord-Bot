const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, channel) => {
    if (!channel.guild) return;
    if(config.ChannelCreateDeleteLogs.Enabled === false) return;
    
    if(!channel.guild.members.me.permissions.has("ViewAuditLogs")) return;
    if (channel.name.startsWith('ticket-')) return;
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: Discord.AuditLogEvent.ChannelCreated,
    });
    
    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) return
    const { executor, target } = deletionLog;
    var embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setTitle(`**${lang.ChannelCreatedEmbedTitle}**`)
        .setDescription(`**${lang.ChannelEmbedUser}** ${executor}\n**${lang.ChannelEmbedChannel}** ${channel.name}`);

        let delLogChannel = channel.guild.channels.cache.get(config.ChannelCreateDeleteLogs.ChannelID);
        if (delLogChannel) return delLogChannel.send({ embeds: [embed] })
};