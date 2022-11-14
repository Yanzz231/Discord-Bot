const Discord = require('discord.js');
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
var dateFormat = require('dateformat');
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, member) => {
  if(member.id === client.user.id) return;

  let AuthorTitle = config.LeaveEmbed.AuthorTitle.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{user-name}/g, `${member.user.username}`);
  let userTagTitle = config.LeaveEmbed.Title.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-name}/g, `${member.user.username}`);
  let embedDescription = config.LeaveEmbed.Description.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{user}/g, `${member}`).replace(/{user-joinedAt}/g, `${dateFormat(member.joinedAt, "mm/dd/yyyy")}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{guildName}/g, `${member.guild.name}`).replace(/{user-name}/g, `${member.user.username}`);
  let embedFooter = config.LeaveEmbed.Footer.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-createdAt}/g, `${dateFormat(member.user.createdAt, "mm/dd/yyyy")}`).replace(/{user-joinedAt}/g, `${dateFormat(member.joinedAt, "mm/dd/yyyy")}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{guildName}/g, `${member.guild.name}`).replace(/{user-name}/g, `${member.user.username}`);
  let normalMsg = config.LeaveNormalMessage.replace(/{user-tag}/g, `${member.user.tag}`).replace(/{user-joinedAt}/g, `${dateFormat(member.joinedAt, "mm/dd/yyyy")}`).replace(/{user}/g, `${member}`).replace(/{memberCount}/g, `${member.guild.memberCount}`).replace(/{guildName}/g, `${member.guild.name}`).replace(/{user-name}/g, `${member.user.username}`);

  var userIcon = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
  let leaveEmbed = new Discord.EmbedBuilder()
  leaveEmbed.setColor(config.LeaveEmbed.EmbedColor)
  if(config.LeaveEmbed.Title) leaveEmbed.setTitle(userTagTitle)
  if(config.LeaveEmbed.AuthorTitle && config.LeaveEmbed.UserIconAuthor) leaveEmbed.setAuthor({ name: `${AuthorTitle}`, iconURL: `${userIcon}` })
  if(config.LeaveEmbed.AuthorTitle && !config.LeaveEmbed.UserIconAuthor) leaveEmbed.setAuthor({ name: `${AuthorTitle}` })
  if(config.LeaveEmbed.UserIconThumbnail) leaveEmbed.setThumbnail(userIcon)
  if(config.LeaveEmbed.Description) leaveEmbed.setDescription(embedDescription)
  if(config.LeaveEmbed.UserRoles) leaveEmbed.addFields([
    { name: "Roles", value: `${member.roles.cache.filter(r => r.id !== member.guild.id).map(roles => `<@&${roles.id}>`).join(", ") || "No Roles"}`, inline: true },
    ])
  if(config.LeaveEmbed.Timestamp) leaveEmbed.setTimestamp()
  if(config.LeaveEmbed.Footer && config.LeaveEmbed.UserIconFooter) leaveEmbed.setFooter({ text: `${embedFooter}`, iconURL: `${userIcon}` })
  if(config.LeaveEmbed.Footer && !config.LeaveEmbed.UserIconFooter) leaveEmbed.setFooter({ text: `${embedFooter}` })

 
   //Leave Messages
  if(config.EnableLeaveMessages) {
    let leaveChannel = member.guild.channels.cache.get(config.LeaveChannel);

    if(config.MessageType === 1) {
    if (leaveChannel) leaveChannel.send({ embeds: [leaveEmbed] })
    } else if(config.MessageType === 2) {
      if (leaveChannel) leaveChannel.send({ content: normalMsg })
    }
  }


  // Member count channel update
  if(config.EnableMemberCount) {
    let memberCountChannel = member.guild.channels.cache.get(config.MemberCountChannel)
    let memberCountMsg = config.MemberCountChannelName.replace(/{total-members}/g, `${member.guild.memberCount}`);
    if (memberCountChannel) memberCountChannel.setName(memberCountMsg).catch(error => console.log(error));
 }

 if(config.LevelingSystem.Enabled && config.LevelingSystem.ResetDataOnLeave && client.userData.has(`${member.user.id}`)) {
  client.userData.set(member.id, 0, "xp");
  client.userData.set(member.id, 0, "level");
 }


 const fetchedLogs = await member.guild.fetchAuditLogs({
  limit: 1,
  type: Discord.AuditLogEvent.MemberKick,
});
const kickLog = fetchedLogs.entries.first();
if(!kickLog) return;
const { executor, target } = kickLog;

let reason;
if(!fetchedLogs.entries.first().reason) reason = "No reason specified"
if(fetchedLogs.entries.first().reason) reason = fetchedLogs.entries.first().reason

if (target.id === member.id && kickLog.createdAt > member.joinedAt && executor.id !== client.user.id) {
    
  await client.userData.ensure(`${member.id}`, {
    guildID: member.id,
    userID: member.id,
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

  const logEmbed = new Discord.EmbedBuilder()
  .setAuthor({ name: `${lang.ModerationEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
  .setColor("Red")
  .addFields([
    { name: `${lang.ModerationEmbedAction}`, value: "``Kick (Discord)``" },
    { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${member.id}>\n\`\`${lang.ModerationEmbedStaff}\`\` <@!${executor.id}>\n\`\`${lang.ModerationEmbedReason}\`\` ${reason}` },
    ])
  .setTimestamp()
  .setFooter({ text: `#${client.guildData.get(`${member.guild.id}`, `cases`)}`, iconURL: `${member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
  let logsChannel = member.guild.channels.cache.get(config.StaffLogsChannel);

  client.guildData.inc(member.guild.id, "cases");
  client.userData.inc(`${member.id}`, "kicks");
  if (logsChannel) logsChannel.send({ embeds: [logEmbed] })

}
// %%__FILEHASH__%% // %%__TIMESTAMP__%%
};