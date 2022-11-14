const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, oldState, newState) => {
    if(!oldState.channel || !newState.channel) return;
    if(config.VoiceChannelLogs.Enabled === false) return;
    if(oldState.member.user.bot) return;

    let embed;
    if (newState.channelId === null) {

    embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setTitle(`**Voice Channel Disconnect**`)
        .setDescription(`**User:** <@!${newState.member.id}>\n**Disconnected from:** ${oldState.channel.name}`);

    } else if (oldState.channelId === null) {

    embed = new Discord.EmbedBuilder()
        .setColor(config.SuccessEmbedColor)
        .setTimestamp()
        .setTitle(`**Voice Channel Connect**`)
        .setDescription(`**User:** <@!${newState.member.id}>\n**Connected to:** ${newState.channel.name}`);

    } else if (oldState.channelId !== newState.channelId) {

    embed = new Discord.EmbedBuilder()
        .setColor("Orange")
        .setTimestamp()
        .setTitle(`**Voice Channel Move**`)
        .setDescription(`**User:** <@!${newState.member.id}>\n**Moved to:** ${newState.channel.name}\n**From:** ${oldState.channel.name}`);

    } else if (oldState.serverDeaf !== newState.serverDeaf && newState.serverDeaf) {

    embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setTitle(`**Voice Channel Server Deafen**`)
        .setDescription(`<@!${newState.member.id}> was Server Deafened!`);

    } else if (oldState.serverDeaf !== newState.serverDeaf && !newState.serverDeaf) {

    embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setTitle(`**Voice Channel Server Undeafen**`)
        .setDescription(`<@!${newState.member.id}> was Undeafened!`);

    } else if (oldState.serverMute !== newState.serverMute && newState.serverMute) {

    embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setTitle(`**Voice Channel Server Mute**`)
        .setDescription(`<@!${newState.member.id}> was Server Muted!`);

    } else if (oldState.serverMute !== newState.serverMute && !newState.serverMute) {

    embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setTitle(`**Voice Channel Server Unmute**`)
        .setDescription(`<@!${newState.member.id}> was Unmuted!`);

    } else if (oldState.streaming !== newState.streaming && newState.streaming) {

    embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setTitle(`**Voice Channel Stream Started**`)
        .setDescription(`**User:** <@!${newState.member.id}>\n**Streaming in:** ${newState.channel.name}`);

    } else if (oldState.streaming !== newState.streaming && !newState.streaming) {

    embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTimestamp()
        .setTitle(`**Voice Channel Stream Stopped**`)
        .setDescription(`**User:** <@!${newState.member.id}>\n**Channel:** ${newState.channel.name}`);

    } else {
      return;
    }

    let voiceLogChannel = newState.guild.channels.cache.get(config.VoiceChannelLogs.ChannelID);
    if (voiceLogChannel) return voiceLogChannel.send({ embeds: [embed] })

// %%__USER__%%

}