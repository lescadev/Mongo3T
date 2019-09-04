//Ici ça sera la logique et le corps du bot, la connexion et l'utilisation des fichiers dans /lib
const Discord = require('discord.js');
const mongoose = require('mongoose');
const requestGit = require('./lib/requestGit');
const repoEvent = require('./lib/Repo');
const userEvent = require('./lib/user');
const helpEvent = require('./lib/command');
const rateEvent = require('./lib/rate');
const leaderboardEvent = require('./lib/leaderboard');
require('dotenv').config({path: '.env.local'});

const uri = process.env.URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
});

const client = new Discord.Client();

client.on('ready', ()=> {
    console.log("Ready");
    client.user.setActivity('GitHub', {type: 'WATCHING'});
    requestGit(client);
    client.on('message', (message)=> {
        repoEvent(client, message);
        userEvent(client, message);
        helpEvent(client, message);
        rateEvent(client, message);
        leaderboardEvent(client, message);
    })
});

client.login(process.env.BOT);
