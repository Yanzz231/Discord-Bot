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
        .setName('clearhistory')
        .setDescription(`Clear a user's history`)
        .addUserOption(option => option.setName('user').setDescription('The user to clear history from').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getUser("user");

        client.userData.set(user.id, 0, "warns");
        client.userData.set(user.id, 0, "bans");
        client.userData.set(user.id, 0, "kicks");
        client.userData.set(user.id, 0, "timeouts");
        client.userData.set(user.id, "None", "note");
        client.userData.set(user.id, [], "warnings");

        let clearHistoryUserVariable = lang.ClearhistorySuccess.replace(/{user}/g, `${user}`)
        const successEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
        .setColor(config.SuccessEmbedColor)
        .setDescription(clearHistoryUserVariable)
        interaction.reply({ embeds: [successEmbed], ephemeral: true });

    }

}