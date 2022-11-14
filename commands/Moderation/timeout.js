/*
  _____  _              ____        _   
 |  __ \| |            |  _ \      | |  
 | |__) | | _____  __  | |_) | ___ | |_ 
 |  ___/| |/ _ \ \/ /  |  _ < / _ \| __|
 | |    | |  __/>  <   | |_) | (_) | |_ 
 |_|    |_|\___/_/\_\  |____/ \___/ \__|
                                        
Thank you for purchasing Plex!
If you find any issues, need support, or have a suggestion for the bot, please join our support server and create a ticket,
https://discord.gg/eRaeJdTsPY
*/

const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require ("discord.js")
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('././config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('././lang.yml', 'utf8'))
const ms = require('parse-duration');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription(`Timeout a user`)
        .addUserOption(option => option.setName('user').setDescription('The user to timeout').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('How long the user should be timed out, for example: 1d, 1h, 1m').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for timeout').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getUser("user");
        let time = interaction.options.getString("time");
        let reason = interaction.options.getString("reason");
        let member = interaction.guild.members.cache.get(user.id)

        const timeInMs = ms(time)
        if(!timeInMs) return interaction.reply({ content: lang.TimeoutValidTime, ephemeral: true })
        if(timeInMs < 10000 || timeInMs > 2419200000) return interaction.reply({ content: lang.TimeoutTimeLimit, ephemeral: true })

        await client.userData.ensure(`${user.id}`, {
            guildID: user.id,
            userID: user.id,
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

          let userTimeoutMsgVariable = lang.TimeoutMsg.replace(/{user}/g, `${user}`).replace(/{time}/g, `${time}`).replace(/{reason}/g, `${reason}`)
          member.timeout(timeInMs, reason)
          interaction.reply({ content: userTimeoutMsgVariable, ephemeral: true })
        
            // User DM
            try {
                let appealLinkLocale = lang.EmbedAppealMsg.replace(/{link}/g, `${config.AppealLink}`)
                let TimedOutEmbedDescriptionLocale = lang.TimedOutEmbedDescription.replace(/{guildName}/g, `${interaction.guild.name}`)
                const dmEmbed = new Discord.EmbedBuilder()
                dmEmbed.setAuthor({ name: `${lang.TimedOutEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
                dmEmbed.setColor("Red")
                dmEmbed.setDescription(TimedOutEmbedDescriptionLocale)
                dmEmbed.addFields([
                  { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedReason}\`\` ${reason}\n\`\`${lang.ModerationEmbedTime}\`\` ${time}` },
                  ])
                if(config.AppealLink) dmEmbed.addFields([
                  { name: `${lang.EmbedAppeal}`, value: `${appealLinkLocale}` },
                  ])

                dmEmbed.setTimestamp()
                dmEmbed.setFooter({ text: `${user.tag}`, iconURL: `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
  
                await member.send({ embeds: [dmEmbed] })
              } catch(e) {
                console.log('\x1b[33m%s\x1b[0m', "[INFO] I tried to DM a user, but their DM's are locked.");
                }
            //

          const logEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${lang.ModerationEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
          .setColor(config.ErrorEmbedColor)
          .addFields([
            { name: `${lang.ModerationEmbedAction}`, value: "``Timeout``" },
            { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${user.id}>\n\`\`${lang.ModerationEmbedStaff}\`\` <@!${interaction.user.id}>\n\`\`${lang.ModerationEmbedTime}\`\` ${time}\n\`\`${lang.ModerationEmbedReason}\`\` ${reason}` },
            ])
          .setTimestamp()
          .setFooter({ text: `#${client.guildData.get(`${interaction.guild.id}`, `cases`)}`, iconURL: `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
          client.guildData.inc(interaction.guild.id, "cases");
          client.userData.inc(`${user.id}`, "timeouts");
        
          let logsChannel = interaction.guild.channels.cache.get(config.StaffLogsChannel);
          if (logsChannel) logsChannel.send({ embeds: [logEmbed] })
        

    }
}