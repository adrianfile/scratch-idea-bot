require('dotenv').config()

const fetch = require('node-fetch')
const Discord = require('discord.js')
const client = new Discord.Client()


client.on('ready', checkReady)
client.on('message', basicCommand)
client.on('messageReactionAdd', addRoleViaReact)

function checkReady() {
    console.log('Im ready')
    client.user.setPresence({ activity: { name: 'Scratch Idea' }, status: 'idle'})
    .then(() => {
        console.log('Sudah ready dan set Activity')
    })
}

async function basicCommand(message) {
    if(message.author.bot) return
    //Prefix
    let prefix = "!"
    const [CMD, ...args] = message.content
    .trim()
        .substring(prefix.length)
            .split(/\s+/)

    //Send GIF
    if(CMD === "gif") {
        message.delete()
        let keywords = "Kitty"
        if(prefix.length > 1) {
            keywords = prefix.slice(1, prefix.length).join(" ")
        }
        let url = `https://g.tenor.com/v1/search?q=${keywords}&key=${process.env.TENOR_KEY}&limit=10&locale=id_ID`
        let response = await fetch(url)
        let json = await response.json()
        const index = Math.floor(Math.random() * json.results.length)
        message.channel.send(json.results[index].url)
        message.channel.send(`Hasil pencarian : ${keywords}`)
    }
    else if(CMD === 'kick'){
        const user = message.mentions.users.first()
        if(user){
            const member = message.guild.member(user);
            if(member){
                let tmp_msg = member
                member
                    .kick()
                        .then(() => {
                            message.reply(`${tmp_msg} sudah terbuang`)
                        })
                        .catch(() => {
                            message.reply("Saya tidak punya kemampuan untuk mengeluarkannya")
                        })
            }
            else {
                message.reply("User tersebut tidak ada")
            }
        }
        else {
            message.reply("Kamu tidak mention Usernya!")
        }
    }
    else if(CMD === "help"){
        message.channel.send("**Fitur tersedia saat ini** \n\t**Filter Chat** - ketikan terlarang \n\t**Kick Member** - !kick [Mentions user]\n\t**GIF** - !gif [Nama Gif] \n\tFitur lain akan tersedia dilain waktu")
    }

    //Ping Bot
    if(CMD === "ping"){
        message.channel.send("Loading ...")
            .then(async (message) => {
                message.delete()
                message.channel.send(`Ping : ${Date.now() - message.createdTimestamp}ms`)
            })
    }

    //Reply
    const kata = ["_Pagi ini indah ya ?_", "_Apakah aku bisa bernyanyi ?_", "_Kata_", "_Bisikan indahmu akan mempesonakan diriku_"]
    if(message.content === "Coba berikan aku kata"){
        const index = Math.floor(Math.random() * kata.length)
        message.reply(kata[index])
    }

    //Filter Katakan
    
    const filter = /(ajg|anjing|kntl|kontol)/
    if(filter.test(message.content)) {
        message.delete()
            .then(message => message.reply('Kata tersebut dilarang diketik'))
    }
}

function addRoleViaReact(reaction, user){
    const name = message.emoji
    const member = reaction.message.guild.members.cache.get(user.id)
    if(reaction.message.id === '828134101655093268k') {
        switch (name) {
            case '😃':
                member.roles.add('828121430041559061')
                break
        }
    }
}


client.login(process.env.DC_BOT_TOKEN)