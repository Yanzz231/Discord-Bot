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
        .setName('pause')
        .setDescription(`Pause the music`),
    async execute(interaction, client) {
        if(config.MusicSettings.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && config.MusicSettings.DisabledCommands.includes('pause')) return interaction.reply({ content: "This music command has been disabled!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && !interaction.member.roles.cache.get(config.MusicSettings.DJRole) && !config.MusicSettings.AllowedUserCommands.includes('pause')) return interaction.reply({ content: "This music command has been restricted to DJ\'s only!", ephemeral: true })
        if(!interaction.member.voice.channel) return interaction.reply({ content: `${client.emotes.error} | ${lang.NotInVoiceChannel}`, ephemeral: true })
        if(interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({ content: `${client.emotes.error} | You are not in the same voice channel as the bot!`, ephemeral: true })
    
        const queue = client.player.getQueue(interaction.guild)
        if (!queue) return interaction.reply({ content: `${client.emotes.error} | ${lang.NothingInQueue}`, ephemeral: true })
        queue.setPaused(true)
        interaction.reply({ content: `${client.emotes.stop} | ${lang.SongPaused}` })

    }

}