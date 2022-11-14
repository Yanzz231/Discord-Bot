const Discord = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, oldMember, newMember) => {
    if(config.UserUpdateLogs.Enabled === false) return;
    if (newMember.user.bot) return;
	if (oldMember.nickname !== newMember.nickname) {

	let avatarurl = newMember.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    var embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTimestamp()
        .setThumbnail(avatarurl)
        .setTitle(`**${lang.NicknameChangedEmbedTitle}**`)
        .addFields([
            { name: `${lang.NicknameOld}`, value: `${oldMember.nickname !== null ? `${oldMember.nickname}` : `None`}` },
            { name: `${lang.NicknameNew}`, value: `${newMember.nickname !== null ? `${newMember.nickname}` : `None`}` },
            ])
        .setDescription(`**${lang.NicknameTag}** <@!${newMember.id}>`);

        let editLogChannel = newMember.guild.channels.cache.get(config.UserUpdateLogs.ChannelID);
        if (editLogChannel) return editLogChannel.send({ embeds: [embed] })
    }


};