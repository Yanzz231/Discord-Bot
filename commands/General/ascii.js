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
const figlet = require('figlet')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription(`Generate ascii`)
        .addStringOption(option => option.setName('text').setDescription('The text to make ascii').setRequired(true)),
    async execute(interaction, client) {

        let text = interaction.options.getString("text");

        figlet.text(text, (err, data) => {
            if (err) return console.log(err)
            if (data.length > 2000) return interaction.reply({ content: lang.AsciiTooLong, ephemeral: true })
            interaction.reply({ content: '```\n' + data + '```' })
        })

    }

}