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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription(`Set slowmode in a channel`)
        .addNumberOption(option => option.setName('amount').setDescription('Slowmode time in seconds (1-21600 Seconds), Set to 0 to disable.').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let amount = interaction.options.getNumber("amount");

        if (amount > 21600) amount = 21600
        if (amount < 0) amount = 1

        if(amount === 0) {
            interaction.channel.setRateLimitPerUser("0")
            return interaction.reply({ content: lang.SlowmodeReset, ephemeral: true })
        }

        interaction.channel.setRateLimitPerUser(amount)
        .catch(() => {
        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.SlowmodeFailed)
        interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        })
    
        let slowmodeMsgVariable = lang.SlowmodeSuccess.replace(/{time}/g, `${amount}`)
        const successEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
        .setColor(config.SuccessEmbedColor)
        .setDescription(slowmodeMsgVariable)
        interaction.reply({ embeds: [successEmbed], ephemeral: true })

    }

}