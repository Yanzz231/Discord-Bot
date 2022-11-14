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
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('././config.yml', 'utf8'))
const backup = require('discord-backup');
const lang = yaml.load(fs.readFileSync('././lang.yml', 'utf8'))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription(`Manage server backups`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a backup of the server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a backup')
                .addStringOption(option => option.setName('id').setDescription('The backup ID').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('load')
                .setDescription('Load a backup')
                .addStringOption(option => option.setName('id').setDescription('The backup ID').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get information about a backup')
                .addStringOption(option => option.setName('id').setDescription('The backup ID').setRequired(true))),
    async execute(interaction, client) {
        return interaction.reply({ content: "This command is currently not working! Please wait for a new bot update.", ephemeral: true })
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let subCmd = interaction.options.getSubcommand()
        let backupID = interaction.options.getString("id");

        // Backup create
        if (subCmd == 'create') {
            await interaction.reply({ content: lang.BackupCreating, ephemeral: true });

            backup.create(interaction.guild).then((backupData) => {
                const successEmbed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
                .setColor(config.SuccessEmbedColor)
                .setDescription(lang.BackupCreatedEmbed)
                .addFields([
                    { name: `${lang.BackupEmbedUsage}`, value: `\`\`\`/backup load ${backupData.id}\`\`\`\n\`\`\`/backup info ${backupData.id}\`\`\`` },
                    ])
                .setFooter({ text: `${lang.BackupCreatedBy} ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` })
                .setTimestamp()
                interaction.editReply({ content: lang.BackupCreatedMsg })
                interaction.user.send({ embeds: [successEmbed] })
                return
            }).catch((err) => {
                console.log(err)
            })
        } else if(subCmd === "delete") {

    backup.fetch(backupID).then((backupData) => {
        backup.remove(backupID)
        const successEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.SuccessEmbedTitle}`, iconURL: `https://i.imgur.com/7SlmRRa.png` })
        .setColor(config.SuccessEmbedColor)
        .setDescription(lang.BackupDeleted)
        interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }).catch((err) => {
        const errorEmbed2 = new Discord.EmbedBuilder()
        .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
        .setColor(config.ErrorEmbedColor)
        .setDescription(lang.BackupNotFound)
        return interaction.reply({ embeds: [errorEmbed2], ephemeral: true });
    });
        } else if(subCmd === "load") {

            backup.fetch(backupID).then(() => {

                let confirmbutton = new ButtonBuilder()
                .setCustomId(`confirm`)
                .setStyle('Success')
                .setLabel(lang.BackupButtonConfirm);
                let cancelbutton = new ButtonBuilder()
                .setCustomId(`cancel`)
                .setStyle('Danger')
                .setLabel(lang.BackupButtonCancel);
                let row = new ActionRowBuilder()
                .addComponents(confirmbutton, cancelbutton);
        
                
                interaction.reply({ content: lang.BackupLoadWarning, components: [row], fetchReply: true }).then(async (m2) => {
        
                    const iFilter = i => i.user.id === interaction.user.id;
                    const collector = m2.createMessageComponentCollector({ filter: iFilter, time: 60000 })
        
                    
                    collector.on('collect', async i => {
                        if(i.customId === 'confirm') {
                            m2.delete()
                            interaction.reply({ content: lang.BackupLoading, ephemeral: true })
                            backup.load(backupID, interaction.guild).then(() => {
        
                                return interaction.user.send(lang.BackupLoaded);
                    
                            })
        
                        } else if(i.customId === 'cancel') {
                            m2.delete()
                            const errorEmbed4 = new Discord.EmbedBuilder()
                            .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                            .setColor(config.ErrorEmbedColor)
                            .setDescription(lang.BackupCancelled)
                            return interaction.reply({ embeds: [errorEmbed4], ephemeral: true });
                        }
                      })
                    })
                }).catch((err) => {
                        
                const errorEmbed2 = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                .setColor(config.ErrorEmbedColor)
                .setDescription(lang.BackupNotFound)
            
                const errorEmbed3 = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                .setColor(config.ErrorEmbedColor)
                .setDescription('An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err))

                if (err === 'No backup found')
                    return interaction.reply({ embeds: [errorEmbed2], ephemeral: true });
                else
                    return interaction.reply({ embeds: [errorEmbed3], ephemeral: true });
        
            }) 

        } else if(subCmd === "info") {

            backup.fetch(backupID).then((backup) => {

                const date = new Date(backup.data.createdTimestamp);
                const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
                const formattedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            
                const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `📁 Backup Info`, iconURL: `${backup.data.iconURL}` })
                .addFields([
                    { name: 'Server name', value: `${backup.data.name}` },
                    { name: 'Size', value: `${backup.size + ' kb'}` },
                    { name: 'Created at', value: `${formattedDate}` },
                    ])
                .setColor(config.SuccessEmbedColor)
                .setFooter({ text: `Backup ID: ${backup.id}` })
                return interaction.reply({ embeds: [embed], ephemeral: true })
            
            }).catch((err) => {
            
                const errorEmbed2 = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                .setColor(config.ErrorEmbedColor)
                .setDescription(lang.BackupNotFound)
            
                const errorEmbed3 = new Discord.EmbedBuilder()
                .setAuthor({ name: `${lang.ErrorEmbedTitle}`, iconURL: `https://i.imgur.com/MdiCK2c.png` })
                .setColor(config.ErrorEmbedColor)
                .setDescription('An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err))
            
                if (err === 'No backup found')
                    return interaction.reply({ embeds: [errorEmbed2], ephemeral: true });
                else
                    return interaction.reply({ embeds: [errorEmbed3], ephemeral: true });
            
            });

        }


    }
}