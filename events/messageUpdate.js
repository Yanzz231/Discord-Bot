const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, oldMessage, newMessage) => {
    if(!newMessage.author || !newMessage.content) return

    if(config.MessageUpdateLogs.Enabled === false) return;
    if (newMessage.author.bot) return;
    if (newMessage.content.includes("https://")) return;

    let avatarurl = newMessage.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    var embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setThumbnail(avatarurl)
        .setTitle(`**${lang.MessageUpdateEmbedTitle}**`)
        .setDescription(`**${lang.MessageUpdateEditedBy}** ${newMessage.author.tag}\n**${lang.MessageUpdateChannel}** ${newMessage.channel}`)
        .addFields([
            { name: lang.MessageUpdateOld, value: `${oldMessage.attachments.size > 0 ? oldMessage.attachments.first().proxyURL : oldMessage.content}` },
            { name: lang.MessageUpdateNew, value: `${newMessage.attachments.size > 0 ? newMessage.attachments.first().proxyURL : newMessage.content}` },
            ])

        let editLogChannel = newMessage.guild.channels.cache.get(config.MessageUpdateLogs.ChannelID);
        if (editLogChannel && config.MessageUpdateLogs.Enabled) editLogChannel.send({ embeds: [embed] })

// %%__USER__%%

// Blacklisted Words
if(config.BlacklistWords.Enabled) {
    let wordBypass = false
    for(let i = 0; i < config.BlacklistWords.BypassRoles.length; i++) {
      if(newMessage.member.roles.cache.has(config.BlacklistWords.BypassRoles[i])) wordBypass = true;
  }
  
  let allow = false
  await config.BlacklistWords.BypassPerms.forEach(perms => {
          if(newMessage.member.permissions.has(perms)) allow = true
  })
  
  if(wordBypass === false && allow === false) {
    let filterWordsMsg = config.BlacklistWords.Message.replace(/{user}/g, `${newMessage.author}`);
    config.BlacklistWords.Words.forEach(eachWord => {
      if(newMessage.content.toLowerCase().search(eachWord.toLowerCase()) >= 0) {
        newMessage.delete();
        newMessage.channel.send(filterWordsMsg).then(msg => setTimeout(() => msg.delete(), 3000));
      }
  })
}
}


}