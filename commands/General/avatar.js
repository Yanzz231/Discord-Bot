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
        .setName('avatar')
        .setDescription(`Get a user's avatar`)
        .addUserOption(option => option.setName('user').setDescription('The user to get the avatar from')),
    async execute(interaction, client) {

        let user = interaction.options.getUser("user");
        let mentionedUser = user || interaction.user;
        let avatarurl = mentionedUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

        let embed = new Discord.EmbedBuilder()
        .setImage(avatarurl)
        .setColor(config.EmbedColors)
        .setTitle(`${mentionedUser.tag}'s Avatar`)
        .setFooter({ text: `${lang.AvatarSearchedBy} ${interaction.user.tag}` })
        .setDescription(`[${lang.AvatarClickHere}](${avatarurl})`);
        interaction.reply({ embeds: [embed] })

    }

}