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
const { Discord, ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('././config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('././lang.yml', 'utf8'))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription(`Send the ticket panel`),
    async execute(interaction, client) {
        if(config.TicketSettings.Enabled === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticketcreate')
                .setEmoji(config.TicketPanelSettings.ButtonEmoji)
                .setLabel(config.TicketPanelSettings.ButtonName)
                .setStyle(config.TicketPanelSettings.ButtonColor)
            )
        var serverIcon = interaction.guild.iconURL();
        const ticketEmbed = new EmbedBuilder()
            ticketEmbed.setAuthor({ name: `${config.TicketPanelSettings.PanelTitle}` })
            ticketEmbed.setDescription(config.TicketPanelSettings.PanelMessage)
            ticketEmbed.setColor(config.EmbedColors)
            if(serverIcon) ticketEmbed.setThumbnail(serverIcon)
            if(!serverIcon) ticketEmbed.setThumbnail()
            ticketEmbed.setFooter({ text: `${interaction.guild.name}` })
            ticketEmbed.setTimestamp()

        interaction.reply({ content: `You successfully sent the ticket panel to this channel!`, ephemeral: true })
        interaction.channel.send({ embeds: [ticketEmbed], components: [row] });

    }

}