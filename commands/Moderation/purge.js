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
        .setName('purge')
        .setDescription(`Purge a specific amount of messages in a channel`)
        .addNumberOption(option => option.setName('amount').setDescription('The amount of messages to purge').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let amount = interaction.options.getNumber("amount");
        if (amount > 100) amount = 100

        const logEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ModerationEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
        .setColor("Red")
        .addFields([
            { name: `${lang.ModerationEmbedAction}`, value: "``Purge``" },
            { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedStaff}\`\` <@!${interaction.user.id}>\n\`\`${lang.ModerationEmbedAmount}\`\` ${amount}\n\`\`${lang.ModerationEmbedChannel}\`\` ${interaction.channel}` },
            ])
        .setTimestamp()
    
        let logsChannel = interaction.guild.channels.cache.get(config.StaffLogsChannel);
                try {
                    let purgeAmountVariable = lang.PurgeCleared.replace(/{amount}/g, `${amount}`)
                    await interaction.channel.bulkDelete(amount)
                    interaction.reply({ content: purgeAmountVariable, ephemeral: true })
                    if (logsChannel) logsChannel.send({ embeds: [logEmbed] })
                } catch(error) {
                    interaction.reply({ content: lang.PurgeOld, ephemeral: true })
                }

    }

}