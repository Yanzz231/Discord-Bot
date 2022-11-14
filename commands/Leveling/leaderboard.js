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
        .setName('leaderboard')
        .setDescription(`View leaderboards`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('levels')
                .setDescription('View the the top 10 users with the highest level'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('messages')
                .setDescription('View the the top 10 users with the most messages')),
    async execute(interaction, client) {

        let subCmd = interaction.options.getSubcommand()

        if(subCmd == 'levels') {
        if(config.LevelingSystem.Enabled  === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })

        const filtered = client.userData.filter(p => p.guildID === interaction.guild.id && p.level > 0 && interaction.guild.members.cache.get(p.userID)).array();
        const sorted = filtered.sort((a, b) => b.level - a.level);
        const top10 = sorted.splice(0, 10);
    
        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.LeaderboardNobodyOnLB)
        if(top10.length < 1) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

          let content = "";
          let i = 0;
          for (const data of top10) {
              i++;
              content += `\`\`${i}.\`\` ${client.users.cache.get(data.userID)} - **Level:** ${data.level}\n`
          }

          let lbEmbedTitleVariable = lang.LeaderboardEmbedTitle.replace(/{guild-name}/g, `${interaction.guild.name}`)
          let icon = interaction.guild.iconURL()
          const embed = new Discord.EmbedBuilder()
          if(icon) embed.setTitle(lbEmbedTitleVariable, icon)
          if(!icon) embed.setTitle(lbEmbedTitleVariable)
          embed.setColor(config.EmbedColors)
          embed.setDescription(`${content}`)
          if(icon) embed.setThumbnail(icon)
          embed.setFooter({ text: `${lang.LeaderboardYourLevel} ${client.userData.get(`${interaction.user.id}`, `level`)}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
          embed.setTimestamp()
      
          interaction.reply({ embeds: [embed] });

    }
    if(subCmd == 'messages') {

        const filtered = client.userData.filter(p => p.guildID === interaction.guild.id && p.totalMessages > 0 && interaction.guild.members.cache.get(p.userID)).array();
        const sorted = filtered.sort((a, b) => b.totalMessages - a.totalMessages);
        const top10 = sorted.splice(0, 10);

        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.LeaderboardNobodyOnLB)
        if(top10.length < 1) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

        let content = "";
        let i = 0;
        for (const data of top10) {
            i++;
            content += `\`\`${i}.\`\` ${client.users.cache.get(data.userID)} - **Messages:** ${data.totalMessages.toLocaleString()}\n`
        }

        let lbEmbedTitleVariable = lang.LeaderboardMessageEmbedTitle.replace(/{guild-name}/g, `${interaction.guild.name}`)
        let icon = interaction.guild.iconURL()
        const embed = new Discord.EmbedBuilder()
        if(icon) embed.setTitle(lbEmbedTitleVariable, icon)
        if(!icon) embed.setTitle(lbEmbedTitleVariable)
        embed.setColor(config.EmbedColors)
        embed.setDescription(`${content}`)
        if(icon) embed.setThumbnail(icon)
        embed.setFooter({ text: `${lang.LeaderboardYourMessages} ${client.userData.get(`${interaction.user.id}`, `totalMessages`)}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        embed.setTimestamp()
    
        interaction.reply({ embeds: [embed] });


    }

}

}