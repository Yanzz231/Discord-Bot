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
        .setName('unban')
        .setDescription(`Unban a user`)
        .addMentionableOption(option => option.setName('userid').setDescription('The user ID to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for unban').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("BanMembers")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getMentionable("userid");
        let reason = interaction.options.getString("reason");

        let ban = await interaction.guild.bans.fetch();

        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.UnbanUserNotBanned)
        if(!ban.get(user.id)) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

        const logEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ModerationEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
        .setColor(config.ErrorEmbedColor)
        .addFields([
            { name: `${lang.ModerationEmbedAction}`, value: "``Unban``" },
            { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${user.id}>\n\`\`${lang.ModerationEmbedStaff}\`\` <@!${interaction.user.id}>\n\`\`${lang.ModerationEmbedReason}\`\` ${reason}` },
            ])
        .setFooter({ text: `#${client.guildData.get(`${interaction.guild.id}`, `cases`)}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
        .setTimestamp()
        let logsChannel = interaction.guild.channels.cache.get(config.StaffLogsChannel);
    
        try {
            interaction.guild.bans.fetch().then(bans => {
                interaction.guild.members.unban(user, reason)
            })
    
            let unbanUserMsgVariable = lang.UnbanMsg.replace(/{user}/g, `<@!${user.id}>`)
            const successEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
            .setColor(config.SuccessEmbedColor)
            .setDescription(unbanUserMsgVariable)
            interaction.reply({ embeds: [successEmbed], ephemeral: true })
            if (logsChannel) logsChannel.send({ embeds: [logEmbed] })
        } catch(e) {
            console.log(e)
        }

    }

}