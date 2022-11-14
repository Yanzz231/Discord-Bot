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
        .setName('setnote')
        .setDescription(`Set a note on a user`)
        .addUserOption(option => option.setName('user').setDescription('The user to set the note on').setRequired(true))
        .addStringOption(option => option.setName('note').setDescription('The note to set on the user').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageRoles")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getUser("user");
        let noteText = interaction.options.getString("note");
        let member = interaction.guild.members.cache.get(user.id)

        const errorEmbed2 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.NoteLongerThan250)
        if(noteText.length > 250) return interaction.reply({ embeds: [errorEmbed2], ephemeral: true })

        const errorEmbed3 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.NoteCantAddBot)
        if(member.bot) return interaction.reply({ embeds: [errorEmbed3], ephemeral: true })

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

          let setNoteMsgVariable = lang.NoteSuccess.replace(/{user}/g, `<@!${user.id}>`)
          const successEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
          .setColor(config.SuccessEmbedColor)
          .setDescription(setNoteMsgVariable)
          interaction.reply({ embeds: [successEmbed], ephemeral: true });
          client.userData.set(user.id, noteText, "note");

    }

}