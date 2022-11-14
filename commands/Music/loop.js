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
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription(`Loop a song`)
        .addStringOption((option) => option.setName('mode').setDescription('Loop mode').addChoices(
            { name: 'Off', value: 'off' }, 
            { name: 'Song', value: 'song' }, 
            { name: 'Queue', value: 'queue' },
        ).setRequired(true)),
    async execute(interaction, client) {
        if(config.MusicSettings.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && config.MusicSettings.DisabledCommands.includes('loop')) return interaction.reply({ content: "This music command has been disabled!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && !interaction.member.roles.cache.get(config.MusicSettings.DJRole) && !config.MusicSettings.AllowedUserCommands.includes('loop')) return interaction.reply({ content: "This music command has been restricted to DJ\'s only!", ephemeral: true })
        if(!interaction.member.voice.channel) return interaction.reply({ content: `${client.emotes.error} | ${lang.NotInVoiceChannel}`, ephemeral: true })
        if(interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({ content: `${client.emotes.error} | You are not in the same voice channel as the bot!`, ephemeral: true })
    
        let choice = interaction.options.getString("mode");
        if(choice === "off") choice = QueueRepeatMode.OFF
        if(choice === "song") choice = QueueRepeatMode.TRACK
        if(choice === "queue") choice = QueueRepeatMode.QUEUE

        const queue = client.player.getQueue(interaction.guild)
        if (!queue) return interaction.reply({ content: `${client.emotes.error} | ${lang.NothingPlaying}`, ephemeral: true })
        queue.setRepeatMode(choice);
        let repeatModeVariable = lang.RepeatMode.replace(/{mode}/g, `${interaction.options.getString("mode")}`)
        interaction.reply({ content: `${client.emotes.repeat} | ${repeatModeVariable}` })

    }

}