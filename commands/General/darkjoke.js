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
        .setName('darkjoke')
        .setDescription(`Get a random dark joke`),
    async execute(interaction, client) {

        let darkjokes = [
            "Give a man a match, and he'll be warm for a few hours. Set a man on fire, and he will be warm for the rest of his life.",
            "My wife and I have reached the difficult decision that we do not want children. If anybody does, please just send me your contact details and we can drop them off tomorrow.",
            "What do you give an armless child for Christmas?\nNothing, he wouldn’t be able to open it anyways.",
            "I took away my ex-girlfriend’s wheelchair.\nGuess who came crawling back to me?",
            "When does a joke become a dad joke?\nWhen it leaves and never comes back.",
            "Can orphans eat at a family restaurant?",
            "A man went into a library and asked for a book on how to commit suicide. The librarian said: “Fuck off, you won’t bring it back.”",
            "My grandma with alzheimer's used to tell us a joke.\nShe’d say “Knock knock”, we’d say “Who’s there?”\nThen she’d say “I can’t remember”… and start to cry.",
            "Why can’t orphans play baseball?\nThey don’t know where home is.",
            "Where did Suzy go after getting lost on a minefield?\nEVERYWHERE!",
            "I’ve been looking for my ex girlfriend’s killer for the past two years. But no one would do it.",
            "What was Steven Hawking’s last words?\nThe windows xp log out sound",
            "When you hit a speed bump in a school zone and remember, there are no speed bumps.",
            "Two kids were beating up a kid in an ally, so I stepped into help. He didn’t stand a chance against the three of us.",
            "My ex got into a bad accident recently. I told the doctors the wrong blood type. Now she will really know what rejection feels like",
            "When Jim was playing on his phone, my grandfather told him, “You use way too much technology!”. Jim then said, “No, YOU use too much technology!” and then Jim disconnected his grandfather’s life support.",
            "I will always remember my grandpa’s last words: Stop shaking the ladder you cunt!",
            "Would you like to try African food??\nThey would too.",
            "Kids in the backseat make accidents and accidents in the back seat make kids.",
            "What do you do when you finish a magazine at a hospital? Reload and keep shooting.",
            "How do you throw a surprise party at a hospital?\nBring a strobe light into the epilepsy ward.",
            "I have a fish that can breakdance! Only for 20 seconds, though, and only once.",
            "What’s the last thing to go through a fly’s head as it hits the windshield of a car going 70 miles per hour?\nIts butt.",
            "My dad died when we couldn’t remember his blood type. As he died, he kept insisting for us to “be positive,” but it’s hard without him.",
            "You don’t need a parachute to go skydiving.\nYou need a parachute to go skydiving twice.",
            "My girlfriend, who’s into astronomy, asked me how stars die. “Usually an overdose,” I told her.",
            "My elderly relatives liked to tease me at weddings, saying, “You’ll be next!” They soon stopped, though, once I started doing the same to them at funerals.",
            "My wife and I have made a difficult choice and have decided we do not want children.\nIf anybody does, please just send me your contact details, and we can drop them off tomorrow.",
            "I want to die peacefully in my sleep, just like my grandfather,\nNot screaming like the passengers in his car.",
            "I started crying when dad was cutting onions. Onions was such a good dog.",
            "If at first, you don’t succeed… then skydiving definitely isn’t for you.",
            "They say there’s a person capable of murder in every friendship group.\nI suspected it was Dave, so I killed him before he could cause any harm.",
            "I’ll never forget my Granddad’s last words to me just before he died. “Are you still holding the ladder?”",
            "What’s yellow and can’t swim? A bus full of children.",
            "The doctor gave me one year to live, so I shot him. The judge gave me 15 years. Problem solved.",
            "When we were kids, we used to be afraid of the dark.\nBut when we grew up, the electricity bill made us afraid of the light!",
            "Patient: Oh doctor, I’m just so nervous. This is my first operation.\nDoctor: Don’t worry. Mine too.",
    
        ];
        let darkjoke = darkjokes[Math.floor(Math.random() * darkjokes.length)];
        interaction.reply({ content: `**🤣 DARK JOKE**\n${darkjoke}` })

    }

}