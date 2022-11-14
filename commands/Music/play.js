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
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(`Play a song`)
        .addStringOption(option => option.setName('query').setDescription('Song to play').setRequired(true)),
    async execute(interaction, client) {
        if(config.MusicSettings.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && config.MusicSettings.DisabledCommands.includes('play')) return interaction.reply({ content: "This music command has been disabled!", ephemeral: true })
        if(config.MusicSettings.EnableDJ && !interaction.member.roles.cache.get(config.MusicSettings.DJRole) && !config.MusicSettings.AllowedUserCommands.includes('play')) return interaction.reply({ content: "This music command has been restricted to DJ\'s only!", ephemeral: true })
        if(!interaction.member.voice.channel) return interaction.reply({ content: `${client.emotes.error} | ${lang.NotInVoiceChannel}`, ephemeral: true })
        if(interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({ content: `${client.emotes.error} | You are not in the same voice channel as the bot!`, ephemeral: true })
        await interaction.deferReply()

        let embed = new Discord.EmbedBuilder()

        const queue = client.player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });

        let justConnected;

        try {
            if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
            justConnected = true;
            }
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

            let url = interaction.options.getString("query")

            const track = await client.player.search(url, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
            if (!track) return await interaction.followUp({ content: `❌ | Track **${url}** not found!` });
    

            if(track.playlist) {
                let AddedToQueuePlaylistVariable = lang.MusicPlaylistAddedToQueue.replace(/{playlist-name}/g, `${track.tracks[0].playlist.title}`).replace(/{playlist-link}/g, `${track.tracks[0].playlist.url}`)
                embed
                .setAuthor({ name: `${lang.MusicEmbedTitle}` })
                .setColor("Red")
                .setDescription(`${client.emotes.play} | ${AddedToQueuePlaylistVariable}`)
                .setFooter({ text: `${lang.MusicAddedBy} ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
                .setTimestamp()
                queue.addTracks(track.tracks);
            } else {
            let AddedToQueueVariable = lang.MusicAddedToQueue.replace(/{song-name}/g, `${track.title}`).replace(/{song-url}/g, `${track.url}`)
            embed
                .setAuthor({ name: `${lang.MusicEmbedTitle}` })
                .setColor("Red")
                .setThumbnail(track.thumbnail)
                .setDescription(`${client.emotes.play} | ${AddedToQueueVariable}`)
                .setFooter({ text: `${lang.MusicAddedBy} ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
                .setTimestamp()
                queue.addTrack(track)
            }

            if(justConnected) queue.play();
            await interaction.editReply({embeds: [embed] })
        }

}