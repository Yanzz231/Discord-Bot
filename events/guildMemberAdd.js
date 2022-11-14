const Discord = require('discord.js');
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const dateFormat = require('dateformat');
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))
const ms = require('ms');

module.exports = async (client, member) => {
  if(member.id === client.user.id) return;

  if(!member.bot) {
    if(config.AltPrevention.Enabled) {
      let logsChannel = member.guild.channels.cache.get(config.AltPrevention.LogsChannelID);
      if (Date.now() - member.user.createdAt < ms(config.AltPrevention.TimeLimit)) {
        let logEmbed = new Discord.EmbedBuilder()
        .setColor("Orange")
        .setTitle(`⚠️ Alt Account Detected ⚠️`)
        .addFields([
          { name: `User`, value: `${member} (${member.user.tag})` },
          { name: `Account Age`, value: `${member.user.createdAt.toLocaleString()}` },
          { name: `Kicked`, value: `${config.AltPrevention.KickAlts}` },
          ])
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        if(config.AltPrevention.dmUser && config.AltPrevention.dmMessage) await member.send(config.AltPrevention.dmMessage)
        
      try{
        if(config.AltPrevention.dmUser && config.AltPrevention.dmMessage) await member.send(config.AltPrevention.dmMessage)
      }catch(e){
          console.log('\x1b[33m%s\x1b[0m', "[INFO] I tried to DM a user, but their DM's are locked.");
        }

        if(config.AltPrevention.KickAlts) await member.kick({ reason: 'ALT Account' })
        if(config.AltPrevention.LogsChannelID && logsChannel) await logsChannel.send({ embeds: [logEmbed] })

  }
}
}

let AuthorTitle = config.LeaveEmbed.AuthorTitle.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{user-name}/g, `${member.user.username}`);
  let userTagTitle = config.WelcomeEmbed.Title.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-name}/g, `${member.user.username}`);
  let embedDescription = config.WelcomeEmbed.Description.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{user}/g, `${member}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{guildName}/g, `${member.guild.name}`).replace(/{user-name}/g, `${member.user.username}`);
  let embedFooter = config.WelcomeEmbed.Footer.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{guildName}/g, `${member.guild.name}`).replace(/{user-name}/g, `${member.user.username}`);
  let normalMsg = config.WelcomeNormalMessage.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{user}/g, `${member}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{guildName}/g, `${member.guild.name}`).replace(/{user-name}/g, `${member.user.username}`);

  var userIcon = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
  let welcomeEmbed = new Discord.EmbedBuilder()
  welcomeEmbed.setColor(config.WelcomeEmbed.EmbedColor)
  if(config.WelcomeEmbed.Title) welcomeEmbed.setTitle(userTagTitle)
  if(config.WelcomeEmbed.AuthorTitle && config.WelcomeEmbed.UserIconAuthor) welcomeEmbed.setAuthor({ name: `${AuthorTitle}`, iconURL: `${userIcon}` })
  if(config.WelcomeEmbed.AuthorTitle && !config.WelcomeEmbed.UserIconAuthor) welcomeEmbed.setAuthor({ name: `${AuthorTitle}` })
  if(config.WelcomeEmbed.UserIconThumbnail) welcomeEmbed.setThumbnail(userIcon)
  if(config.WelcomeEmbed.Description) welcomeEmbed.setDescription(embedDescription)
  if(config.WelcomeEmbed.Timestamp) welcomeEmbed.setTimestamp()
  if(config.WelcomeEmbed.Footer && config.WelcomeEmbed.UserIconFooter) welcomeEmbed.setFooter({ text: `${embedFooter}`, iconURL: `${userIcon}` })
  if(config.WelcomeEmbed.Footer && !config.WelcomeEmbed.UserIconFooter) welcomeEmbed.setFooter({ text: `${embedFooter}` })
  
  // Welcome messages
  if(config.EnableWelcomeMessages) {
    let welcomeChannel = member.guild.channels.cache.get(config.WelcomeChannel);

    if(config.MessageType === 1) {
    if (welcomeChannel) welcomeChannel.send({ embeds: [welcomeEmbed] })
    } else if(config.MessageType === 2) {
      if (welcomeChannel) welcomeChannel.send({ content: normalMsg })
    }
  }

 // Join role
  if(config.JoinRoleSettings.Enabled) {
    config.JoinRoleSettings.JoinRoles.forEach(async roleid => {
      let role = member.guild.roles.cache.get(roleid);
      if(role) await member.roles.add(role);
  });
// %%__USER__%%

// Automatically add unverified role to users if it's enabled and the verification system is enabled
if(config.VerificationSettings.Enabled && config.VerificationSettings.EnableUnverifiedRole) {
  let verifData = client.verification.get(member.guild.id)
  let role = member.guild.roles.cache.get(verifData.unverifiedRoleID)
  if(role) member.roles.add(role)
}

}


};