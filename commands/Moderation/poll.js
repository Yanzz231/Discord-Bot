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
        .setName('poll')
        .setDescription(`Create a poll for users to vote on`)
        .addStringOption(option => option.setName('question').setDescription('The poll question').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let question = interaction.options.getString("question");

        var userIcon = interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
        const pollembed = new Discord.EmbedBuilder()
        .setTitle(lang.PollEmbedTitle)
        .setColor(config.EmbedColors)
        .setDescription(question)
        .setFooter({ text: `${lang.PollEmbedFooter} ${interaction.user.tag}`, iconURL: `${userIcon}` })
    
        interaction.reply({ embeds: [pollembed], fetchReply: true }).then(function (message) {
            message.react("👍")
            message.react("👎")
          }).catch(function() {
           });

    }

}