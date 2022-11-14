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
        .setName('snipe')
        .setDescription(`Get the last deleted message`),
    async execute(interaction, client) {

        const snipeMsg = client.snipes.get(interaction.guild.id)
        if(!snipeMsg) return interaction.reply({ content: lang.SnipeNoMsg, ephemeral: true })
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${snipeMsg.author}`, iconURL: `${snipeMsg.member.user.displayAvatarURL()}` })
        .setDescription(snipeMsg.content)
        .setColor(config.EmbedColors)
        .setTimestamp()

        interaction.reply({ embeds: [embed] })

    }

}