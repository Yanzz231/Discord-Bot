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
const ms = require('parse-duration');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription(`Manage giveaways`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a giveaway')
                .addChannelOption(option => option.setName('channel').setDescription('The channel you want to create the giveaway in').setRequired(true))
                .addStringOption(option => option.setName('time').setDescription('How long the giveaway should be, for example: 1d, 1h, 1m').setRequired(true))
                .addIntegerOption(option => option.setName('winners').setDescription('How many users can win the giveaway?').setRequired(true))
                .addStringOption(option => option.setName('prize').setDescription('Giveaway Prize').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a giveaway')
                .addStringOption(option => option.setName('id').setDescription('The message ID of the giveaway').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End a giveaway')
                .addStringOption(option => option.setName('id').setDescription('The message ID of the giveaway').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll a giveaway')
                .addStringOption(option => option.setName('id').setDescription('The message ID of the giveaway').setRequired(true))),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let subCmd = interaction.options.getSubcommand()

        if (subCmd == 'create') {
            let gTime = ms(interaction.options.getString("time"))
            let prize = (interaction.options.getString("prize"))
            let channel = (interaction.options.getChannel("channel"))
            let winners = (interaction.options.getInteger("winners"))

            client.giveawaysManager.start(channel, {
                duration: gTime,
                prize: prize,
                winnerCount: parseInt(winners),
                messages: {
                  giveaway: lang.GiveawayEmbedTitle,
                  giveawayEnded: lang.GiveawayEmbedEndedTitle,
                  drawing: lang.GiveawayDrawing,
                  dropMessage: lang.GiveawayDropMessage,
                  inviteToParticipate: lang.GiveawayReact,
                  winMessage: lang.GiveawayWinMessage,
                  embedFooter: lang.GiveawayEmbedFooter,
                  noWinner: lang.GiveawayNoWinner,
                  hostedBy: lang.GiveawayHostedBy,
                  winners: lang.GiveawayWinners,
                  endedAt: lang.GiveawayEndedAt,
              }
            })

            let gCreateVariable = lang.GiveawayCreateStart.replace(/{channel}/g, `${channel}`)
            const successEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
            .setColor(config.SuccessEmbedColor)
            .setDescription(gCreateVariable)
        
            interaction.reply({ embeds: [successEmbed], ephemeral: true })

        } else if(subCmd == 'delete') {
            let msgID = (interaction.options.getString("id"))

            client.giveawaysManager.delete(msgID).then(() => {
                const successEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
                .setColor(config.SuccessEmbedColor)
                .setDescription(lang.GiveawayDeleteSuccess)
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
              }).catch((err) => {
              const errorEmbed = new Discord.EmbedBuilder()
              .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
              .setColor(config.ErrorEmbedColor)
              .setDescription(lang.GiveawayDeleteMsgID)
              interaction.reply({ embeds: [errorEmbed], ephemeral: true })
              });

            } else if(subCmd == 'end') {
            let msgID = (interaction.options.getString("id"))

            client.giveawaysManager.end(msgID).then(() => {
                const successEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
                .setColor(config.SuccessEmbedColor)
                .setDescription(lang.GiveawayEndSuccess)
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                  const errorEmbed = new Discord.EmbedBuilder()
                  .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                  .setColor(config.ErrorEmbedColor)
                  .setDescription(lang.GiveawayDeleteMsgID)
                  interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                });

            } else if(subCmd == 'reroll') {
            let msgID = (interaction.options.getString("id"))

            client.giveawaysManager.reroll(msgID).then(() => {
                const successEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
                .setColor(config.SuccessEmbedColor)
                .setDescription(lang.GiveawayRerollSuccess)
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
              }).catch((err) => {
                const errorEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                .setColor(config.ErrorEmbedColor)
                .setDescription(lang.GiveawayDeleteMsgID)
                interaction.reply({ embeds: [errorEmbed], ephemeral: true })
              });
            
            }






    }

}