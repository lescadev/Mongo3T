//Ici ça sera la logique et le corps du bot, la connexion et l'utilisation des fichiers dans /lib
const Discord = require('discord.js');
require('dotenv').config({path: '.env.local'});

const client = new Discord.Client();

client.on('ready', ()=> {
    console.log("Ready");
    client.user.setActivity('GitHub', {type: 'WATCHING'});
});

client.login(process.env.BOT);