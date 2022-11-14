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
        .setName('embed')
        .setDescription(`Create an embed using buttons`),
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ManageMessages")) return interaction.reply({ content: lang.NoPermsMessage, ephemeral: true })

        let bool = 1;
        let embed2 = new EmbedBuilder()
        .setAuthor({ name: "Embed Builder" })
        .setColor(config.EmbedColors)
        .setDescription("Welcome to the **interactive embed builder**. Use the buttons below to build the embed, when you're done click **Post Embed**!")
        let id = new Date().getTime();


        let row1 = new ActionRowBuilder().addComponents(
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("title" + id)
            .setLabel("Title Text")
            .setStyle("Secondary")
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("description" + id)
            .setLabel("Description Text")
            .setStyle("Secondary")
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("footer" + id)
            .setLabel("Footer Text")
            .setStyle("Secondary")
        )
        let row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("thumbnail" + id)
            .setLabel("Thumbnail Image")
            .setStyle("Secondary")
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("image" + id)
            .setLabel("Large Image")
            .setStyle("Secondary")
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("footerimage" + id)
            .setLabel("Footer Image")
            .setStyle("Secondary")
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("color" + id)
            .setLabel("Embed Color")
            .setStyle("Secondary")
        )
        let row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("timestamp" + id)
            .setStyle("Secondary")
            .setLabel("Add Timestamp")
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("post" + id)
            .setStyle("Danger")
            .setLabel("Post Embed")
        )
        
        let buttons = [row1, row2, row3];
        interaction.reply({ embeds: [embed2], components: buttons, ephemeral: true });
        const filter = click => click.user.id === interaction.member.id;
        const wordFilter = rep => { return rep.author.id === interaction.member.id };
        const collecter = interaction.channel.createMessageComponentCollector({ filter, time: 900000 });

        let embed = EmbedBuilder.from(embed2)

        collecter.on("collect", async function(click) {
            if (bool == 1) {
                embed.data.description = null,
                embed.data.author.name = null;
                bool = 0;
            };
            if (click.customId == "timestamp" + id) {
                try { embed.setTimestamp(); } catch {};
                click.update({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "title" + id) {
                click.update({ content: "What would you like to set the title text to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setTitle(response.content); } catch {};
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "description" + id) {
                click.update({ content: "What would you like to set the description to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setDescription(response.content); } catch {};
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "footer" + id) {
                click.update({ content: "What would you like to set the footer text to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setFooter({ text: response.content || " ", iconURL: embed.footer?.iconURL }); } catch (e) { console.log(e.stack) };
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "color" + id) {
                click.update({ content: "What color would you like to set the embed to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setColor(response.content); } catch {};
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "thumbnail" + id) {
                click.update({ content: "What would you like to set the thumbnail image to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setThumbnail(response.content || response.attachments.first().url); } catch {};
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "image" + id) {
                click.update({ content: "What would you like to set the large image to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setImage(response.content || response.attachments.first().url); } catch {};
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "footerimage" + id) {
                click.update({ content: "What would you like to set the footer image to?", components: [] });
                let response = await waitResponse(interaction.channel, wordFilter);
                if (!response) return returnHome(interaction, buttons);
                try { embed.setFooter({ text: embed.footer.text || " ", iconURL: response.content || response.attachments.first().url }); } catch {};
                click.editReply({ embeds: [embed], content: " ", components: buttons });
            } else if (click.customId == "post" + id) {
                interaction.channel.send({ embeds: [embed] });
                click.update({ embeds: [], components: [], content: "Successfully posted the embed!" })
            };
        })
        
        async function waitResponse(channel, filter) {
            let msg = await interaction.channel.awaitMessages({ filter: filter, max: 1, time: 120000 });
            try {
                msg.first().delete();
                return msg.first()
            } catch {
                return undefined;
            }
        };
        
        function returnHome(interaction, buttons) {
            interaction.editReply({ components: buttons, content: " " })
        };

    }

}