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
        .setName('meme')
        .setDescription(`Get a random meme`),
    async execute(interaction, client) {
        await interaction.deferReply()

        await fetch('https://www.reddit.com/r/dankmemes/random/.json')
        .then(res => res.json())
        .then(res => {
      
        let permalink = res[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = res[0].data.children[0].data.url;
        let memeTitle = res[0].data.children[0].data.title;
        let memeUpvotes = res[0].data.children[0].data.ups;
        let memeDownvotes = res[0].data.children[0].data.downs;
        let memeNumComments = res[0].data.children[0].data.num_comments;
      
        const embed = new Discord.EmbedBuilder();
            embed.setTitle(memeTitle)
            embed.setDescription(`[${lang.MemeViewThread}](${memeUrl})`);
            embed.setColor(config.EmbedColors)
            embed.setImage(memeImage)
            embed.setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })
            interaction.editReply({ embeds: [embed] })
      })

    }

}