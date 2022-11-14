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
const canvacord = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription(`Check your level and xp`),
    async execute(interaction, client) {
        if(config.LevelingSystem.Enabled  === false) return interaction.reply({ content: "This command has been disabled in the config!", ephemeral: true })
        await interaction.deferReply()

        await client.userData.ensure(`${interaction.user.id}`, {
            guildID: interaction.guild.id,
            userID: interaction.user.id,
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

        let user = client.userData.get(`${interaction.user.id}`);
        let xpNeeded;
        if(user.level === 0) xpNeeded = 50
        if(user.level > 0) xpNeeded = user.level * config.LevelingSystem.XPNeeded;

        const card = new canvacord.Rank()
        .setUsername(interaction.user.username)
        .setDiscriminator(interaction.user.discriminator)
        .setRank(0)
        .setBackground("IMAGE", "./commands/Leveling/rankcard.png")
        .setLevel(user.level)
        .setCustomStatusColor(config.RankCard.StatusColor)
        .setLevelColor(config.RankCard.LevelColor)
        .setOverlay("#1c1c1c", "0.8", true)
        .setProgressBar(config.RankCard.ProgressBarColor, "COLOR")
        .setRank(0, "RANK", false)
        .setCurrentXP(user.xp)
        .setRequiredXP(xpNeeded)
        .setAvatar(interaction.user.displayAvatarURL({ format: "jpg" }));

    const img = await card.build();
    let attachment = new Discord.AttachmentBuilder(img, { name:"rank.png" });
    interaction.editReply({ files: [attachment] })

    }

}