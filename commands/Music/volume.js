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
        .setName('volume')
        .setDescription(`Adjust the volume`)
        .addIntegerOption(option => option.setName('volume').setDescription('Volume').setRequired(true)),
    async execute(interaction, client) {
        if(config.MusicSettings.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && config.MusicSettings.DisabledCommands.includes('volume')) return interaction.reply({ content: "This music command has been disabled!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && !interaction.member.roles.cache.get(config.MusicSettings.DJRole) && !config.MusicSettings.AllowedUserCommands.includes('volume')) return interaction.reply({ content: "This music command has been restricted to DJ\'s only!", ephemeral: true })
        if(!interaction.member.voice.channel) return interaction.reply({ content: `${client.emotes.error} | ${lang.NotInVoiceChannel}`, ephemeral: true })
        if(interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({ content: `${client.emotes.error} | You are not in the same voice channel as the bot!`, ephemeral: true })
    
        let volume = interaction.options.getInteger("volume")

        const queue = client.player.getQueue(interaction.guild)
        if (!queue || !queue.playing) return interaction.reply({ content: `${client.emotes.error} | ${lang.NothingInQueue}`, ephemeral: true })
        queue.setVolume(volume)
        let volumeVariable = lang.VolumeSet.replace(/{volume}/g, `${volume}`)
        interaction.reply({ content: `${client.emotes.success} | ${volumeVariable}` })
    }

}