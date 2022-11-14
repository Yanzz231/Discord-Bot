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
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dogfact')
        .setDescription(`Get a random dog fact`),
    async execute(interaction, client) {
        await interaction.deferReply()

        let infoWeb = await fetch('https://api-monkedev.herokuapp.com/facts/cat')
        let dogfact = await infoWeb.json();
        interaction.editReply({ content: `**🐶 RANDOM DOG FACT**\n${dogfact.fact}` })

    }

}