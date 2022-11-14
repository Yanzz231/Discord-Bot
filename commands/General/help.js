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
        .setName('help')
        .setDescription(`View a list of all the commands`),
    async execute(interaction, client) {

        let icon = interaction.guild.iconURL();
        let helpembed = new Discord.EmbedBuilder()
        helpembed.setTitle(`${config.BotName}'s Command List`)
        helpembed.setColor(config.EmbedColors)

        helpembed.addFields([
            { name: "👤 | General — 16", value: "``8ball``, ``advice``, ``ascii``, ``avatar``, ``cat``, ``catfact``, ``coinflip``, ``darkjoke``, ``dog``, ``dogfact``, ``fliptext``, ``meme``, ``serverinfo``, ``snipe``, ``userinfo``, ``suggest``" },
            ])

        helpembed.addFields([
            { name: "🛠️ | Moderation — 14", value: "``addrole``, ``removerole``, ``warn``, ``checkwarns``, ``kick``, ``ban``, ``poll``, ``purge``, ``slowmode``, ``unban``, ``timeout``, ``clearhistory``, ``embed``, ``nuke``" },
            ])

        if(config.MusicSettings.Enabled) helpembed.addFields([
            { name: "🎵 | Music — 8", value: "``play``, ``skip``, ``resume``, ``queue``, ``volume``, ``stop``, ``loop``, ``pause``" },
            ])

        if(config.LevelingSystem.Enabled) helpembed.addFields([
            { name: "⌨️ | Leveling System — 2", value: "``rank``, ``leaderboard``" },
            ])

        helpembed.addFields([
            { name: "🛠️ | Utility — 3", value: "``giveaway``, ``setbirthday``" },
            ])

        if(icon) helpembed.setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        helpembed.setTimestamp();
    
        interaction.reply({ embeds: [helpembed] })

    }

}