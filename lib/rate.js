const sendMessage = require('./sendMessage');
const { RichEmbed } = require('discord.js');
const axios = require('axios');
const moment = require('moment');

const commandRepo = (client, message) => {
    if(message.content === '!rate'){
        message.delete();
        axios.get(`https://api.github.com/rate_limit?client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}`)
        .then((response)=> {
            let heure = moment.unix(response.data.rate.reset).locale('fr').format("LTS");
            let remain = response.data.rate.remaining;

            let embed = new RichEmbed()
                .setDescription(`Il reste ${remain} requêtes disponibles \n Reinitialisation à ${heure}`)
                .setColor('#11A529');
            sendMessage(client, embed);
        })
    }
}

module.exports = commandRepo;