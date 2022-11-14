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
        .setName('checkwarns')
        .setDescription(`View a user's warn history`)
        .addUserOption(option => option.setName('user').setDescription('The user to view warn history').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getUser("user");

        await client.userData.ensure(`${user.id}`, {
            guildID: user.id,
            userID: user.id,
            xp: 0,
            level: 0,
            warns: 0,
            bans: 0,
            kicks: 0,
            timeouts: 0,
            note: "None",
            warnings: [],
            totalMessages: 0,
            birthday: null
          });

        const warnIDs = client.userData.get(user.id, 'warnings');
        warnIDs.reverse()

        const userWarnings = warnIDs.map((d) => {
        return d.map((w, i) => `\nStaff: \`${interaction.guild.members.cache.get(w.Moderator).user.tag}\`\nReason: \`${w.Reason}\`\nDate: \`${w.Date}\``)
        })

        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.CheckWarnsNotFound)

        if(!userWarnings.length) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

        let Embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${user.tag}'s Warnings`, iconURL: `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
            .setColor(config.EmbedColors)
            .setTimestamp()
            .setFooter({ text: `Total Warnings: ${warnIDs.length}`, iconURL: `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
            .setDescription(`${userWarnings.join('\n')}`)
            interaction.reply({ embeds: [Embed], ephemeral: true })

    }

}