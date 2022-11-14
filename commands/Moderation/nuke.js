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
        .setName('nuke')
        .setDescription(`Delete all messages in a channel`),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })
        
        interaction.reply(`Nuking channel..`);
        const position = interaction.channel.position;
        const newChannel = await interaction.channel.clone();
        await interaction.channel.delete();
        newChannel.setPosition(position);
        newChannel.send(`This channel was nuked by ${interaction.member}`);
        return newChannel.send("https://media1.tenor.com/images/e275783c9a40b4551481a75a542cdc79/tenor.gif?itemid=3429833")

    }

}