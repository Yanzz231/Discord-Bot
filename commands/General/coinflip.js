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
        .setName('coinflip')
        .setDescription(`Flip a coin`),
    async execute(interaction, client) {

        let coinFlipTitle = lang.CoinflipMsg.replace(/{user-tag}/g, `${interaction.user.tag}`);
        let coinFlipDesc = lang.CoinflipDone.replace(/{result}/g, `${Math.random() > 0.5 ? 'Heads' : 'Tails'}`);
        let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${coinFlipTitle}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        .setColor(config.EmbedColors)  
        .setDescription(coinFlipDesc)
        .setTimestamp()
        interaction.reply({ embeds: [embed] })

    }

}