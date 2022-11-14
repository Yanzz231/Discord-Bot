if (process.platform !== "win32") require("child_process").exec("npm install");

const colors = require('ansi-colors');
console.log(`${colors.yellow(`Starting bot, this can take a while..`)}`);

const fs = require('fs');
const packageFile = require('./package.json');
let logMsg = `\n\n[${new Date().toLocaleString()}] [STARTING] Attempting to start the bot..\nNodeJS Version: ${process.version}\nBot Version: ${packageFile.version}`;
fs.appendFile("./logs.txt", logMsg, (e) => { 
  if(e) console.log(e);
});

const version = Number(process.version.split('.')[0].replace('v', ''));
if (version < 16) {
  console.log('\x1b[31m%s\x1b[0m', `[ERROR] Plex Bot requires a NodeJS version of 16.9 or higher!`)

  let logMsg = `\n\n[${new Date().toLocaleString()}] [ERROR] Plex Bot requires a NodeJS version of 16.9 or higher!`;
  fs.appendFile("./logs.txt", logMsg, (e) => { 
    if(e) console.log(e);
  });
  process.exit()
}

const { Collection, Client, GatewayIntentBits, Partials } = require('discord.js');
const Discord = require('discord.js');
const backup = require("discord-backup")

const client = new Client({ 
  restRequestTimeout: 60000,
  partials: [Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildBans,
  ]
});


module.exports = client
require("./utils.js");

const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('././lang.yml', 'utf8'))

if(!fs.existsSync('./data')) fs.mkdirSync('./data');

// Error Handler
client.on('warn', async (error) => {
  console.log(error)
  console.log('\x1b[31m%s\x1b[0m', `[v${packageFile.version}] If you need any support, please create a ticket in our discord server and provide the logs.txt file\n\n`)

  let errorMsg = `\n\n[${new Date().toLocaleString()}] [WARN] [v${packageFile.version}]\n${error.stack}`;
  fs.appendFile("./logs.txt", errorMsg, (e) => { 
    if(e) console.log(e);
  });
})

client.on('error', async (error) => {
  console.log(error)
  console.log('\x1b[31m%s\x1b[0m', `[v${packageFile.version}] If you need any support, please create a ticket in our discord server and provide the logs.txt file\n\n`)

  let errorMsg = `\n\n[${new Date().toLocaleString()}] [ERROR] [v${packageFile.version}]\n${error.stack}`;
  fs.appendFile("./logs.txt", errorMsg, (e) => { 
    if(e) console.log(e);
  });
})

process.on('unhandledRejection', async (error) => {
  console.log(error)
  console.log('\x1b[31m%s\x1b[0m', `[v${packageFile.version}] If you need any support, please create a ticket in our discord server and provide the logs.txt file\n\n`)

  let errorMsg = `\n\n[${new Date().toLocaleString()}] [unhandledRejection] [v${packageFile.version}]\n${error.stack}`;
  fs.appendFile("./logs.txt", errorMsg, (e) => { 
    if(e) console.log(e);
  });
})

process.on('uncaughtException', async (error) => {
  console.log(error)
  console.log('\x1b[31m%s\x1b[0m', `[v${packageFile.version}] If you need any support, please create a ticket in our discord server and provide the logs.txt file\n\n`)

  let errorMsg = `\n\n[${new Date().toLocaleString()}] [uncaughtException] [v${packageFile.version}]\n${error.stack}`;
  fs.appendFile("./logs.txt", errorMsg, (e) => { 
    if(e) console.log(e);
  });
})


// Star board
if(config.StarBoard.Enabled) {
client.on('messageReactionAdd', async (reaction, user) => {
  await reaction.fetch()
  if (user.bot || !reaction.message.guild) return
  let channel = reaction.message.guild.channels.cache.get(config.StarBoard.ChannelID)
    
  if (channel && config.StarBoard.Enabled && reaction.emoji.name === config.StarBoard.Emoji) {
      const stars = client.guildData.get(reaction.message.guild.id, `stars.${reaction.message.id}`)

      if (stars) {
          await channel.messages.fetch(stars.board).catch(() => {}).then(msg => {
          if (!msg) return client.guildData.delete(reaction.message.guild, `stars.${reaction.message.id}`)
          const count = reaction.count

          const fetchedMsg = msg.first();
          const embed = fetchedMsg.embeds[0]
          // %%__USER__%%
          embed.footer.text = `${count} ${config.StarBoard.Emoji}`
          fetchedMsg.edit({ embeds: [embed] })
          })
      } else if (reaction.count >= config.StarBoard.Reactions) {
        console.log(reaction.message)
          const embed = new Discord.EmbedBuilder()
              .setColor("Yellow")
              .addFields([
                { name: 'Details', value: `> \`\`User:\`\` ${reaction.message.author}\n> \`\`Channel:\`\`\ ${reaction.message.channel}\n> \`\`Message:\`\`\ [Click here](${reaction.message.url})` },
                ])
              .setThumbnail(reaction.message.author.displayAvatarURL({ dynamic: true }))
              .setFooter({ text: `${reaction.count} ${config.StarBoard.Emoji}` })
              .setTimestamp()

          if (reaction.message.content) embed.addFields([
            { name: 'Content', value: `${reaction.message.content}` },
            ])
          if (['png', 'jpg', 'jpeg', 'gif', 'webp'].some(e => (reaction.message.attachments.first() || { url: '' }).url.endsWith(e))) embed.setImage(reaction.message.attachments.first().url)
          let msg = await channel.send({ embeds: [embed] })
          client.guildData.set(reaction.message.guild.id, { board: msg.id }, `stars.${reaction.message.id}`)
      }
  }
})
}


backup.setStorageFolder(__dirname+"/data/Backups");