const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const fetch = require('node-fetch');
const lang = yaml.load(fs.readFileSync('./lang.yml', 'utf8'))

module.exports = async (client, reaction, user) => {
    if(config.StarBoard.Enabled && reaction.emoji.name === config.StarBoard.Emoji) return
    let guild = client.guilds.cache.get(config.GuildID)
    reaction.message.fetch();
    if(!user) return;
    if(user.bot) return;
    if(!reaction) return;
    if(!reaction.message.channel.guild) return;
    config.ReactionRoles.forEach(reaction2 => {
        let regex = reaction2.emojiName.replace(/[0-9]/g, '').replace(/[:]/g, '').replace(/[<]/g, '').replace(/[>]/g, '')
        let emoji = regex || reaction2.emojiName
        if(reaction.message.id == reaction2.messageID && reaction.emoji.name == emoji) {
            let role = reaction.message.channel.guild.roles.cache.get(reaction2.roleID);
            if(!role) return console.log(`[REACTION ROLES] Role (${reaction2.roleID}) not found in ReactionRoles.roleID`)
            const user2 = guild.members.cache.get(user.id)
            if(!user2.roles.cache.has(role.id)) {
                user2.roles.add(role).catch(console.error);
            } else {
                user2.roles.remove(role).catch(console.error);
            }
        }
    })

}