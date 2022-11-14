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
        .setName('serverinfo')
        .setDescription(`Get information about the server`),
    async execute(interaction, client) {

        let date = interaction.guild.createdAt
        let nowdate = new Date()
        let timedif = Math.abs(nowdate.getTime() - date.getTime())
        let daydif = timedif / (1000 * 3600 * 24)

        if(interaction.guild.verificationLevel === "NONE") interaction.guild.verificationLevel = "None"
        if(interaction.guild.verificationLevel === "LOW") interaction.guild.verificationLevel = "Low"
        if(interaction.guild.verificationLevel === "MEDIUM") interaction.guild.verificationLevel = "Medium"
        if(interaction.guild.verificationLevel === "HIGH") interaction.guild.verificationLevel = "High"
        if(interaction.guild.verificationLevel === "VERY_HIGH") interaction.guild.verificationLevel = "Very High"
    
        if(interaction.guild.defaultMessageNotifications === "ALL_MESSAGES") interaction.guild.defaultMessageNotifications = "All Messages"
        if(interaction.guild.defaultMessageNotifications === "ONLY_MENTIONS") interaction.guild.defaultMessageNotifications = "Only Mentions"

        let icon = interaction.guild.iconURL()
        let serverInfo = new Discord.EmbedBuilder()
        if(icon) serverInfo.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${icon}` })
        if(!icon) serverInfo.setAuthor({ name: `${interaction.guild.name}` })
        serverInfo.addFields([
            { name: "Server Details:", value: `> **Name:** ${interaction.guild.name}\n> **ID:** ${interaction.guild.id}\n> **Owner:** <@!${interaction.guild.ownerId}>\n> **Created at:** ${moment(interaction.guild.createdAt).format('DD/MM/YY')} (${parseInt(daydif)} days)\n> **Verification:** ${interaction.guild.verificationLevel}\n> **Notifications:** ${interaction.guild.defaultMessageNotifications}` },
            { name: "Server Stats:", value: `> **Members:** ${interaction.guild.memberCount}\n> **Roles:** ${interaction.guild.roles.cache.size}\n> **Channels:** ${interaction.guild.channels.cache.size}\n> **Emojis:** ${interaction.guild.emojis.cache.size}\n> **Stickers:** ${interaction.guild.stickers.cache.size}\n> **Boosts:** ${interaction.guild.premiumSubscriptionCount}` },
            ])
        serverInfo.setColor(config.EmbedColors)
        if(icon) serverInfo.setThumbnail(icon)
        serverInfo.setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        serverInfo.setTimestamp()

        interaction.reply({ embeds: [serverInfo] })

    }

}