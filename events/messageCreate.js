const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))
const ms = require('parse-duration');
const colors = require('ansi-colors');

let spamData = new Map();

module.exports = async (client, message) => {
    if(!message.channel.type === "GUILD_TEXT") return;
    if(message.author.bot) return;
    
    const talkedRecently = new Set();

    await client.userData.ensure(`${message.author.id}`, {
        guildID: config.GuildID,
        userID: message.author.id,
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

    // Total Message counters
    await client.guildData.inc(config.GuildID, "totalMessages");
    await client.userData.inc(message.author.id, "totalMessages");

    // Give user XP if leveling system is enabled
    if(config.LevelingSystem.Enabled && message.channel.id !== config.VerificationSettings.ChannelID) xp(message)

// XP Function
async function xp(message) {
  if(config.LevelingSystem.Enabled === false) return;
  if(message.content.startsWith(config.CommandsPrefix)) return;
  if(config.LevelingSystem.DisabledChannels.includes(message.channel.id)) return;
  if(config.LevelingSystem.EnableXPCooldown && talkedRecently.has(message.author.id,message.guild.id)) return;
  var min = config.LevelingSystem.MinXP;
  var max = config.LevelingSystem.MaxXP;
  const randomXp = Math.floor(Math.random() * (max - min + 1)) + min;
  let userXP = client.userData.get(`${message.author.id}`, "xp");
  let setXP = userXP + randomXp;
  client.userData.set(message.author.id, setXP, "xp");
  let level = client.userData.get(`${message.author.id}`, "level");
  let xp = client.userData.get(`${message.author.id}`, "xp");
  let xpNeeded;
  if(level === 0) xpNeeded = 70
  if(level > 0) xpNeeded = level * config.LevelingSystem.XPNeeded;
  if(config.LevelingSystem.EnableXPCooldown) {
    let cldwn = ms(config.LevelingSystem.XPCooldown)
    talkedRecently.add(message.author.id,message.guild.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id,message.guild.id);
    }, cldwn);
  }

  if(xpNeeded < xp){

      client.userData.inc(message.author.id, "level");
      let newLevelUser = client.userData.get(`${message.author.id}`, "level");
      client.userData.math(message.author.id, `-`, xpNeeded, `xp`)
      let levelupmessage = config.LevelingSystem.LevelUpMessage.replace(/{user}/g, `${message.author}`).replace(/{level}/g, `${newLevelUser}`);
      let lvlUpC = message.guild.channels.cache.get(config.LevelingSystem.LevelUpChannelID);
      if(!config.LevelingSystem.LevelUpChannelID) message.channel.send(levelupmessage)
      if(config.LevelingSystem.LevelUpChannelID && lvlUpC) lvlUpC.send(levelupmessage)

      // Level up roles
      let newLvl = await config.LevelingSystem.LevelUpRoles.find(reward => reward.level === newLevelUser)
      if(config.LevelingSystem.StackRoles === false && newLvl && message.guild.roles.cache.get(newLvl.roleID)) config.LevelingSystem.LevelUpRoles.forEach(async role => {
        if(message.member.roles.cache.get(role.roleID)) await message.member.roles.remove(role.roleID)
       });
      if(newLvl && message.guild.roles.cache.get(newLvl.roleID)) await message.member.roles.add(newLvl.roleID)
  }
}


// Blacklisted Words
if(config.BlacklistWords.Enabled) {
    let wordBypass = false
    for(let i = 0; i < config.BlacklistWords.BypassRoles.length; i++) {
      if(message.member.roles.cache.has(config.BlacklistWords.BypassRoles[i])) wordBypass = true;
  }
  
  let allow = false
  await config.BlacklistWords.BypassPerms.forEach(perms => {
      if(message.member.permissions.has(perms)) allow = true
  })
  if(wordBypass === false && allow === false) {
    let filterWordsMsg = config.BlacklistWords.Message.replace(/{user}/g, `${message.author}`);
    config.BlacklistWords.Words.forEach(eachWord => {
      if(message.content.toLowerCase().search(eachWord.toLowerCase()) >= 0) {
          message.delete();
          message.channel.send(filterWordsMsg).then(msg => setTimeout(() => msg.delete(), 3000));
      }
  })
}
}

// Anti Discord Invites System
if(config.AntiInviteLinks.Enabled) {
    let inviteBypass = false
    for(let i = 0; i < config.AntiInviteLinks.BypassRoles.length; i++) {
      if(message.member.roles.cache.has(config.AntiInviteLinks.BypassRoles[i])) inviteBypass = true;
    }
    
    let allow = false
    await config.AntiInviteLinks.BypassPerms.forEach(perms => {
            if(message.member.permissions.has(perms)) allow = true
    })
    
    if(inviteBypass === false && allow === false) {
      let discordInvitesMsg = config.AntiInviteLinks.Message.replace(/{user}/g, `${message.author}`);
      const adURL = (str) => {
        var regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
        if (!regex.test(str)) {
          return false;
        } else {
          return true;
        }
      };
      if (adURL(message.content)) {
        message.delete();
        message.channel.send(discordInvitesMsg).then(msg => setTimeout(() => msg.delete(), 3000));
    
        const timeInMs = ms(config.AntiInviteLinks.TimeoutTime)
        if(config.AntiInviteLinks.TimeoutUser) message.member.timeout(timeInMs, `Posting Invite Link (Auto Moderation)`).catch(e => {})
    
        const logEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.AutoModeration}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
        .setColor(config.ErrorEmbedColor)
        .addFields([
          { name: lang.ModerationEmbedAction, value: "``Timeout (AutoMod)``" },
          { name: lang.ModerationEmbedDetails, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${message.author.id}>\n\`\`${lang.ModerationEmbedTime}\`\` ${config.AntiInviteLinks.TimeoutTime}\n\`\`${lang.ModerationEmbedReason}\`\` Sending Invite Link` },
          ])
        .setTimestamp()
        .setFooter({ text: `#${client.guildData.get(`${message.guild.id}`, `cases`)}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        if(config.AntiInviteLinks.TimeoutUser) client.guildData.inc(message.guild.id, "cases");
        if(config.AntiInviteLinks.TimeoutUser) client.userData.inc(`${message.author.id}`, "timeouts");
      
                // User DM
                if(config.AntiInviteLinks.TimeoutUser) try {
                  let appealLinkLocale = lang.EmbedAppealMsg.replace(/{link}/g, `${config.AppealLink}`)
                  let TimedOutEmbedDescriptionLocale = lang.TimedOutEmbedDescription.replace(/{guildName}/g, `${message.guild.name}`)
                  const dmEmbed = new Discord.EmbedBuilder()
                  dmEmbed.setAuthor({ name: `${lang.TimedOutEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
                  dmEmbed.setColor("Red")
                  dmEmbed.setDescription(TimedOutEmbedDescriptionLocale)
                  dmEmbed.addFields([
                    { name: lang.ModerationEmbedDetails, value: `\`\`${lang.ModerationEmbedReason}\`\` Posting Invite Link\n\`\`${lang.ModerationEmbedTime}\`\` ${config.AntiInviteLinks.TimeoutTime}` },
                    ])
                  if(config.AppealLink) dmEmbed.addFields([
                    { name: lang.EmbedAppeal, value: `${appealLinkLocale}` },
                    ])

                  dmEmbed.setTimestamp()
                  dmEmbed.setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
    
                  await message.author.send({ embeds: [dmEmbed] })
                } catch(e) {
                  console.log('\x1b[33m%s\x1b[0m', "[INFO] I tried to DM a user, but their DM's are locked.");
                  }
              //
    
        let logsChannel = message.guild.channels.cache.get(config.StaffLogsChannel);
        if (logsChannel && config.AntiInviteLinks.TimeoutUser) logsChannel.send({ embeds: [logEmbed] })
    }
}
}

// Anti Mass Mention
if(config.AntiMassMention.Enabled) {
    let mentionBypass = false
    for(let i = 0; i < config.AntiMassMention.BypassRoles.length; i++) {
      if(message.member.roles.cache.has(config.AntiMassMention.BypassRoles[i])) mentionBypass = true;
    }
    
    let allow = false
    await config.AntiMassMention.BypassPerms.forEach(perms => {
            if(message.member.permissions.has(perms)) allow = true
    })
  
    if(mentionBypass === false && allow === false) {
      let massMentionMsg = config.AntiMassMention.Message.replace(/{user}/g, `${message.author}`);
      if (message.mentions.users.size > config.AntiMassMention.Amount) {
        message.delete();
        message.channel.send(massMentionMsg).then(msg => setTimeout(() => msg.delete(), 3000));
  
        const timeInMs = ms(config.AntiMassMention.TimeoutTime)
        if(config.AntiMassMention.TimeoutUser) message.member.timeout(timeInMs, `Mass Mention (Auto Moderation)`).catch(e => {})
  
        const logEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.AutoModeration}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
        .setColor(config.ErrorEmbedColor)
        .addFields([
          { name: lang.ModerationEmbedAction, value: "``Timeout (AutoMod)``" },
          { name: lang.ModerationEmbedDetails, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${message.author.id}>\n\`\`${lang.ModerationEmbedTime}\`\` ${config.AntiMassMention.TimeoutTime}\n\`\`${lang.ModerationEmbedReason}\`\` Mass Mention` },
          ])
        .setTimestamp()
        .setFooter({ text: `#${client.guildData.get(`${message.guild.id}`, `cases`)}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        if(config.AntiMassMention.TimeoutUser) client.guildData.inc(message.guild.id, "cases");
        if(config.AntiMassMention.TimeoutUser) client.userData.inc(`${message.author.id}`, "timeouts");
      
              // User DM
              if(config.AntiMassMention.TimeoutUser) try {
                let appealLinkLocale = lang.EmbedAppealMsg.replace(/{link}/g, `${config.AppealLink}`)
                let TimedOutEmbedDescriptionLocale = lang.TimedOutEmbedDescription.replace(/{guildName}/g, `${message.guild.name}`)
                const dmEmbed = new Discord.EmbedBuilder()
                dmEmbed.setAuthor({ name: `${lang.TimedOutEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
                dmEmbed.setColor("Red")
                dmEmbed.setDescription(TimedOutEmbedDescriptionLocale)
                dmEmbed.addFields([
                  { name: lang.ModerationEmbedDetails, value: `\`\`${lang.ModerationEmbedReason}\`\` Mass Mention\n\`\`${lang.ModerationEmbedTime}\`\` ${config.AntiMassMention.TimeoutTime}` },
                  ])
                if(config.AppealLink) dmEmbed.addFields([
                  { name: lang.EmbedAppeal, value: `${appealLinkLocale}` },
                  ])

                dmEmbed.setTimestamp()
                dmEmbed.setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
  
                await message.author.send({ embeds: [dmEmbed] })
              } catch(e) {
                console.log('\x1b[33m%s\x1b[0m', "[INFO] I tried to DM a user, but their DM's are locked.");
                }
            //
  
        let logsChannel = message.guild.channels.cache.get(config.StaffLogsChannel);
        if (logsChannel && config.AntiMassMention.TimeoutUser) logsChannel.send({ embeds: [logEmbed] })
      }
    }
}

// Anti Spam
if(config.AntiSpam.Enabled) {
    let spamBypass = false
    for(let i = 0; i < config.AntiSpam.BypassRoles.length; i++) {
      if(message.member.roles.cache.has(config.AntiSpam.BypassRoles[i])) spamBypass = true;
    }
    
    let allow = false
    await config.AntiSpam.BypassPerms.forEach(perms => {
            if(message.member.permissions.has(perms)) allow = true
    })
  
    if(spamBypass === false && allow === false) {
      let antiSpamMsg = config.AntiSpam.Message.replace(/{user}/g, `${message.author}`);
  
      if(spamData.has(message.author.id)) {
        const userData = spamData.get(message.author.id);
        let msgCount = userData.msgCount;
        if (parseInt(msgCount) === config.AntiSpam.MsgLimit) {
          await message.channel.bulkDelete(config.AntiSpam.MsgLimit)
          await message.channel.send(antiSpamMsg).then(msg => setTimeout(() => msg.delete(), 3000));
          const timeInMs = ms(config.AntiSpam.TimeoutTime)
          await spamData.delete(message.author.id);
          if(config.AntiSpam.TimeoutUser) await message.member.timeout(timeInMs, `Spamming (Auto Moderation)`).catch(e => {})
  
          const logEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${lang.AutoModeration}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
          .setColor(config.ErrorEmbedColor)
          .addFields([
            { name: lang.ModerationEmbedAction, value: "``Timeout (AutoMod)``" },
            { name: lang.ModerationEmbedDetails, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${message.author.id}>\n\`\`${lang.ModerationEmbedTime}\`\` ${config.AntiSpam.TimeoutTime}\n\`\`${lang.ModerationEmbedReason}\`\` Spamming` },
            ])
          .setTimestamp()
          .setFooter({ text: `#${client.guildData.get(`${message.guild.id}`, `cases`)}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
          if(config.AntiSpam.TimeoutUser) client.guildData.inc(message.guild.id, "cases");
          if(config.AntiSpam.TimeoutUser) client.userData.inc(`${message.author.id}`, "timeouts");
        
              // User DM
              if(config.AntiSpam.TimeoutUser) try {
                let appealLinkLocale = lang.EmbedAppealMsg.replace(/{link}/g, `${config.AppealLink}`)
                let TimedOutEmbedDescriptionLocale = lang.TimedOutEmbedDescription.replace(/{guildName}/g, `${message.guild.name}`)
                const dmEmbed = new Discord.EmbedBuilder()
                dmEmbed.setAuthor({ name: `${lang.TimedOutEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
                dmEmbed.setColor("Red")
                dmEmbed.setDescription(TimedOutEmbedDescriptionLocale)
                dmEmbed.addFields([
                  { name: lang.ModerationEmbedDetails, value: `\`\`${lang.ModerationEmbedReason}\`\` Mass Mention\n\`\`${lang.ModerationEmbedTime}\`\` ${config.AntiSpam.TimeoutTime}` },
                  ])
                if(config.AppealLink) dmEmbed.addFields([
                  { name: lang.EmbedAppeal, value: `${appealLinkLocale}` },
                  ])

                dmEmbed.setTimestamp()
                dmEmbed.setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
  
                await message.author.send({ embeds: [dmEmbed] })
              } catch(e) {
                console.log('\x1b[33m%s\x1b[0m', "[INFO] I tried to DM a user, but their DM's are locked.");
                }
            //
  
          let logsChannel = message.guild.channels.cache.get(config.StaffLogsChannel);
          if (logsChannel && config.AntiSpam.TimeoutUser) logsChannel.send({ embeds: [logEmbed] })
  
          return
      }
      msgCount++;
      userData.msgCount = msgCount;
      spamData.set(message.author.id, userData);
    } else {
      spamData.set(message.author.id, {
        msgCount: 1,
      });
      setTimeout(() => {
        spamData.delete(message.author.id);
      }, ms(config.AntiSpam.TimeLimit));
    }
  }
}


// Custom commands
if(config.CommandsEnabled) {
    config.CustomCommands.forEach(cmd => {

      let messageArray = message.content.split(" ");
      let command = messageArray[0].toLowerCase();
      messageArray.slice(1);
      let commandfile = command.slice(config.CommandsPrefix.length);
      if(message.content.startsWith(config.CommandsPrefix) && commandfile === cmd.command) {

        let logMsg = `\n\n[${new Date().toLocaleString()}] [CUSTOM COMMAND] Command: ${cmd.command}, User: ${message.author.tag}`;
        fs.appendFile("./logs.txt", logMsg, (e) => { 
          if(e) console.log(e);
        });

        if(config.LogCommands) console.log(`${colors.yellow(`[CUSTOM COMMAND] ${colors.cyan(`${message.author.tag}`)} used ${colors.cyan(`${config.CommandsPrefix}${cmd.command}`)}`)}`);

        let respEmbed = new Discord.EmbedBuilder()
        .setColor(config.EmbedColors)
        .setDescription(`${cmd.response}`)

        if(cmd.deleteMsg) setTimeout(() => message.delete(), 100);
        if(cmd.replyToUser && cmd.Embed) message.reply({ embeds: [respEmbed] })
        if(cmd.replyToUser === false && cmd.Embed) message.channel.send({ embeds: [respEmbed] })

        if(cmd.replyToUser && cmd.Embed === false) message.reply({ content: `${cmd.response}` })
        if(cmd.replyToUser === false && cmd.Embed === false) message.channel.send({ content: `${cmd.response}` })
        
      }
    })
  }

// Auto Responses
if(config.AutoResponse.Enabled) {
  if(Object.keys(config.AutoResponse.Responses).some(o => message.content.toLowerCase().includes(o.toLowerCase()) || message.content.toLowerCase().startsWith(o.toLowerCase()))) {
    let oWord = Object.keys(config.AutoResponse.Responses).filter(o => Object.keys(config.AutoResponse.Responses).some(a => message.content.toLowerCase().includes(o.toLowerCase())));
    let listIndex = Object.keys(config.AutoResponse.Responses).indexOf(oWord[0]);

    let respMsg = Object.values(config.AutoResponse.Responses)[listIndex];

    if(config.AutoResponse.MessageType == "EMBED") {
      let respEmbed = new Discord.EmbedBuilder()
        .setColor(config.EmbedColors)
        .setDescription(`${message.author}, ${respMsg}`)
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()

        message.reply({ embeds: [respEmbed] });
      } else if(config.AutoResponse.MessageType == "TEXT") {
        message.reply({ content: respMsg });
      } else {
        console.log("Invalid message type for auto response message specified in the config!")
      }
    }
}


if(config.VerificationSettings.Enabled && config.VerificationSettings.DeleteAllMessages && message.channel.id === config.VerificationSettings.ChannelID) {
  message.delete().catch(e => {})
}

}