const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, message) => {
    if(!message.author || !message.content) return

    if(!message.author.bot) client.snipes.set(message.guild.id, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })

    if(config.MessageDeleteLogs.Enabled === false) return;
    if (message.author.bot) return;

    let avatarurl = message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    if (message.content.length > 1900) {var text = "*Content truncated due to length* - " + message.content.substr(0,1900)} else {var text = message.content};
    var embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setThumbnail(avatarurl)
        .setTitle(`**${lang.MessageDeletedEmbedTitle}**`)
        .setDescription(`**${lang.MessageDeletedTag}** ${message.author.tag}\n**${lang.MessageDeletedChannel}** ${message.channel}\n**${lang.MessageDeletedContent}** ${message.attachments.size > 0 ? message.attachments.first().proxyURL : text}`);

        let delLogChannel = message.guild.channels.cache.get(config.MessageDeleteLogs.ChannelID);
        if (delLogChannel) delLogChannel.send({ embeds: [embed] })
};
