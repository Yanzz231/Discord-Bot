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
const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  DISCORD_PARTNER: 'Discord Partner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: 'Verified Bot',
  VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription(`Get information about a certain user`)
        .addUserOption(option => option.setName('user').setDescription('The user to get information from')),
    async execute(interaction, client) {

        let user = interaction.options.getUser("user");
        let mentionedUser = user || interaction.user;

        let member = interaction.guild.members.cache.get(mentionedUser.id)
        let date = mentionedUser.createdAt
        let nowdate = new Date()
        let timedif = Math.abs(nowdate.getTime() - date.getTime())
        let daydif = timedif / (1000 * 3600 * 24)
        let highestRole = member.roles.highest || "*None*";
        let nickname = member.nickname || "*None*";
        const userFlags = member.user.flags.toArray();
    
        if (mentionedUser.bot === true) {
          bot = "Yes"
        } else {
          bot = "No"
        }

        let userInfo = new Discord.EmbedBuilder()
        .setAuthor({ name: `${mentionedUser.tag}`, iconURL: `${mentionedUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        .addFields([
          { name: "Member Details:", value: `> **Nickname:** ${nickname}\n> **Joined at:** ${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY")}\n> **Highest Role:** ${highestRole}` },
          { name: "User Details:", value: `> **ID:** ${mentionedUser.id}\n> **Username:** ${mentionedUser.username}\n> **Created at:** ${moment(mentionedUser.createdAt).format('DD/MM/YY')} (${parseInt(daydif)} days)\n> **Badges:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\n> **Bot:** ${bot}` },
          ])

        .setColor(config.EmbedColors)
        .setThumbnail(mentionedUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        .setTimestamp()
        interaction.reply({ embeds: [userInfo] })

    }

}