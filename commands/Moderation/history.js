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
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription(`View a user's history`)
        .addUserOption(option => option.setName('user').setDescription('The user to view history').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getUser("user");
        let member = interaction.guild.members.cache.get(user.id)

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
          let userData = client.userData.get(`${user.id}`);

          let historyEmbedTitleVariable = lang.HistoryEmbedTitle.replace(/{user-tag}/g, `${user.tag}`)
          let avatarurl = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
          let historyembed = new Discord.EmbedBuilder()
              .setColor("Orange")
              .setTitle(historyEmbedTitleVariable)
              .setThumbnail(avatarurl)
              .addFields([
                { name: `${lang.HistoryEmbedUserInfo}`, value: `\`\`${lang.HistoryEmbedName}\`\` <@!${user.id}>\n\`\`${lang.HistoryEmbedJoinedServer}\`\` ${moment(member.joinedAt).format('DD/MM/YY')}\n\`\`${lang.HistoryTotalMessages}\`\` ${userData.totalMessages.toLocaleString()}\n\`\`${lang.HistoryEmbedNote}\`\` ${userData.note}`, inline: true },
                { name: `${lang.HistoryEmbedWarnings}`, value: `${userData.warns}`, inline: true },
                { name: `${lang.HistoryEmbedTimeouts}`, value: `${userData.timeouts}`, inline: true },
                { name: `${lang.HistoryEmbedKicks}`, value: `${userData.kicks}`, inline: true },
                { name: `${lang.HistoryEmbedBans}`, value: `${userData.bans}`, inline: true },
                ])
              .setTimestamp()
              .setFooter({ text: `${interaction.guild.name}` })
              interaction.reply({ embeds: [historyembed], ephemeral: true })

    }

}