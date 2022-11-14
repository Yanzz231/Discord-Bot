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
        .setName('add')
        .setDescription(`Add a user to a ticket`)
        .addUserOption(option => option.setName('user').setDescription('The user to add to the ticket').setRequired(true)),
    async execute(interaction, client) {
        if(config.TicketSettings.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        if(!interaction.channel.name.startsWith(`ticket-`)) return interaction.reply({ content: lang.NotInTicketChannel, ephemeral: true  })

        let user = interaction.options.getUser("user");
        interaction.channel.permissionOverwrites.create(user, {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true
        });

        let logsChannel = interaction.guild.channels.cache.get(config.TicketSettings.LogsChannelID);
        const log = new Discord.EmbedBuilder()
        .setColor(config.SuccessEmbedColor)
        .setTitle(lang.TicketLogUserAddEmbedTitle)
        .setDescription(`**${lang.TicketLogUser}** - ${interaction.user}\n**${lang.TicketLogTicket}** - ${interaction.channel.name}\n**${lang.TicketLogAdded}** - ${user}`)
        .setTimestamp()

        let ticketAddMsgVariable = lang.TicketUserAdded.replace(/{user}/g, `${aUser}`).replace(/{user-tag}/g, `${aUser.tag}`)
        const embed = new Discord.EmbedBuilder()
        .setColor(config.SuccessEmbedColor)
        .setDescription(ticketAddMsgVariable)
    
        interaction.reply({ embeds: [embed] })
        if(logsChannel) return logsChannel.send({ embeds: [log] })

    }

}