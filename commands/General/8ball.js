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
        .setName('8ball')
        .setDescription(`Ask the bot a question`)
        .addStringOption(option => option.setName('question').setDescription('The question to ask the bot').setRequired(true)),
    async execute(interaction, client) {

        let replies = lang.EightBallReplies
        let result = Math.floor((Math.random() * replies.length));
        let question = interaction.options.getString("question");

        let ballembed = new Discord.EmbedBuilder()
        .setColor(config.EmbedColors)
        .addFields([
            { name: lang.EightBallQuestion, value: `${question}` },
            { name: lang.EightBallAnswer, value: `${replies[result]}` },
            ])
        .setTimestamp()
        interaction.reply({ embeds: [ballembed] })

    }

}