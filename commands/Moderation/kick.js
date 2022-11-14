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
        .setName('kick')
        .setDescription(`Kick a user`)
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for kick').setRequired(true)),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("KickMembers")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let user = interaction.options.getUser("user");
        let reason = interaction.options.getString("reason");
        let member = interaction.guild.members.cache.get(user.id)

        const errorEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.KickCantKickBots)
    
        const errorEmbed2 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.KickCantKickUser)
    
        const errorEmbed3 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.KickCantKickself)

        if(user.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed3], ephemeral: true })
        if(!member.kickable) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        if(member.bot) return interaction.reply({ embeds: [errorEmbed2], ephemeral: true })

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

          const logEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${lang.ModerationEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
          .setColor("Red")
          .addFields([
            { name: `${lang.ModerationEmbedAction}`, value: "``Kick``" },
            { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedUser}\`\` <@!${member.id}>\n\`\`${lang.ModerationEmbedStaff}\`\` <@!${interaction.user.id}>\n\`\`${lang.ModerationEmbedReason}\`\` ${reason}` },
            ])
          .setTimestamp()
          .setFooter({ text: `#${client.guildData.get(`${interaction.guild.id}`, `cases`)}`, iconURL: `${member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
          let logsChannel = interaction.guild.channels.cache.get(config.StaffLogsChannel);
      
          async function kickUser() {
              let kickMsgVariable = lang.KickMsg.replace(/{user}/g, `<@!${member.id}>`).replace(/{reason}/g, `${reason}`)

            // User DM
            try {
                let KickEmbedDescriptionLocale = lang.KickEmbedDescription.replace(/{guildName}/g, `${interaction.guild.name}`)
                const dmEmbed = new Discord.EmbedBuilder()
                dmEmbed.setAuthor({ name: `${lang.KickEmbedTitle}`, iconURL: `https://i.imgur.com/FxQkyLb.png` })
                dmEmbed.setColor("Red")
                dmEmbed.setDescription(KickEmbedDescriptionLocale)
                dmEmbed.addFields([
                  { name: `${lang.ModerationEmbedDetails}`, value: `\`\`${lang.ModerationEmbedReason}\`\` ${reason}` },
                  ])
                dmEmbed.setTimestamp()
                dmEmbed.setFooter({ text: `${user.tag}`, iconURL: `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
  
                await member.send({ embeds: [dmEmbed] })
              } catch(e) {
                console.log('\x1b[33m%s\x1b[0m', "[INFO] I tried to DM a user, but their DM's are locked.");
                }
            //

              await member.kick({ reason: reason }).catch(error => interaction.reply({ content: `Sorry, I couldn't ban because of an error`, ephemeral: true }));
              interaction.reply({ content: kickMsgVariable, ephemeral: true })
              client.guildData.inc(interaction.guild.id, "cases");
              client.userData.inc(`${member.id}`, "kicks");
              if (logsChannel) logsChannel.send({ embeds: [logEmbed] })
            }
            kickUser()

    }

}