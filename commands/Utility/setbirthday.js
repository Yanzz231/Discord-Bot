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
const { parse } = require('date-and-time')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbirthday')
        .setDescription(`Set your birthday`)
        .addStringOption(option => option.setName('date').setDescription('Your birthday, Example: May 4 2004').setRequired(true)),
    async execute(interaction, client) {
        if(config.BirthdaySystem.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })

        let dString = interaction.options.getString("date");

        const getAge = b => {
            let age = new Date().getFullYear() - new Date(b).getFullYear()
            const m = new Date().getMonth() - new Date(b).getMonth()
            if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate()))
                age--;
        
            return age
        }

        const capitalizeFirstLetter = string => {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.BirthdayOnce)
        
        const errorEmbed2 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.BirthdayDate)

        let bdayGreaterLocale = lang.BirthdayGreater.replace(/{year}/g, `${new Date().getFullYear() - 12}`)
        const errorEmbed3 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(bdayGreaterLocale)

        await client.userData.ensure(`${interaction.user.id}`, {
            guildID: interaction.user.id,
            userID: interaction.user.id,
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

        if(client.userData.get(interaction.user.id, `birthday`) !== null) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

        const birthd = capitalizeFirstLetter(dString)
        const date = parse(birthd, 'MMMM D YYYY')
        if(!date || isNaN(date)) return interaction.reply({ embeds: [errorEmbed2], ephemeral: true })

        const age = getAge(dString)
        if (age <= 12) return interaction.reply({ embeds: [errorEmbed3], ephemeral: true })

        let bdayDescLocale = lang.BirthdayEmbedDescription.replace(/{date}/g, `${birthd}`)
        let embed = new Discord.EmbedBuilder()
        .setColor(config.EmbedColors)
        .setTitle(lang.BirthdayEmbedTitle)
        .setDescription(bdayDescLocale)
        .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        .setTimestamp()

        client.userData.set(interaction.user.id, birthd, `birthday`)

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}