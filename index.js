/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');
const cheerio = require('cheerio')

const fetch = require('node-fetch');


// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

 async function fetchServerData() {
   return await fetch('https://www.battlemetrics.com/servers/rust/2550042')
    .then(res => res.text())
    .then(text => {
       try {
         const $ = cheerio.load(text)
         var serverInfo = $('.dl-horizontal dd')
         serverInfo = serverInfo.map((d) => {return serverInfo[d].children[0].data})

         serverObject = {
           pop: serverInfo[1],
           ip: serverInfo[2],
           status: serverInfo[3],
           map: serverInfo[7],
           size: serverInfo[8],
         }
         return serverObject
       } catch (e) {
         console.log(e)
       }
     })
 }



client.on('ready', () => {
  console.log('I am ready!');

  fetchServerData().then((server) => {

      console.log(server);
      if(server.map == "nzau80") {
        server.map = "Oceania by Snowballfred"
      }
      client.user.setActivity(server.pop + ' - ' + server.map.match(/(.*) by (.*)/)[1], { type: '' });

  })
});

client.setInterval(() => {
  fetchServerData().then((server) => {

      console.log(server);
      if(server.map == "nzau80") {
        server.map = "Oceania by Snowballfred"
      }

      client.user.setActivity(server.pop + ' - ' + server.map.match(/(.*) by (.*)/)[1], { type: '' });

  })
}, 60000)

// Create an event listener for messages
client.on('message', message => {

  if (message.content === '!au') {
    fetchServerData().then((server) => {

        console.log(server);
        if(server.map == "nzau80") {
          server.map = "Oceania by Snowballfred"
        }

        const embed = new Discord.RichEmbed()
          .setTitle('Rustography AU Main')
          .setColor(0xFF0000)
          .setDescription('**Server pop: **' + server.pop +
                          '\n**Map: **' + server.map +
                          '\n**IP: **' + server.ip
                        )
          .setImage('https://media.discordapp.net/attachments/477365612008439808/477391151058518016/Mapssss.png?width=485&height=485')

        message.channel.send(embed);
      }
    )
  }

});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('NDc3MzkxMTIyNjE2ODExNTMw.Dk7fKA.cNzl8lUaK9tQ8nqEpbkeZkLtJ78');
