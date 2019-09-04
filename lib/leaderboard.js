const { RichEmbed } = require('discord.js');
const sendMessage = require('./sendMessage');
const User = require('../models/User.model');
const axios = require('axios');

const commandLeaderboard = (client, message) => {
    if(message.content.startsWith('!leaderboard ')) {
        message.delete();
        let repo = message.content.substr(13);
        axios.get(`https://api.github.com/repos/${process.env.ORGA}/${repo}/stats/contributors?client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}`)
        .then(async (response)=> {
            const leaderboard = await generateLeaderboard(response.data);
            const orderedLeaderboard = leaderboard.sort((a, b)=> parseFloat(b.score) - parseFloat(a.score));

            const embed = await generateString(orderedLeaderboard, message);

            sendMessage(client, embed);

        }).catch((error)=> {
            let embed = new RichEmbed()
                .setDescription(`Un problème est survenu`)
                .setColor('#9d0000');
            sendMessage(client, embed);
            console.log(error)
        })
    }
}

const calculStat = (element) => {
    return new Promise((resolve, reject)=> {
        let process = 0;
        let addition = 0;
        element.weeks.forEach(stat => {
            addition += stat.a;
            process++
            if (process === element.weeks.length){
                resolve(addition);
            }
        })
    })
}

const generateLeaderboard = (data) => {
    return new Promise((resolve, reject)=> {
        let leaderboard = []
        let process = 0;
            data.forEach(async (element) => {
                process++
                let addition = await calculStat(element);
                let individualScore = {
                    github_name: element.author.login,
                    score: addition
                };
                leaderboard.push(individualScore);
                if(process === data.length){
                    resolve(leaderboard);
                }
        });
    })
}

const generateString = (leaderboard, message) => {
    return new Promise((resolve, reject)=> {
        let embed = new RichEmbed()
            .setTitle(`Classement pour ${message.content.substr(13)}`)
            .setColor('#11A529')
        let process = 0;
        let gitmsg = ""
        let scoremsg = "";
        leaderboard.forEach((gitprofile)=> {
            process++;
            switch(process){
                case 1:
                    gitmsg += `:first_place: ${gitprofile.github_name}\n`;
                    scoremsg += `${gitprofile.score}:gem: \n`;
                    break
                case 2:
                    gitmsg += `:second_place: ${gitprofile.github_name}\n`;
                    scoremsg += `${gitprofile.score}:gem: \n`;
                    break
                case 3:
                    gitmsg += `:third_place: ${gitprofile.github_name}\n`;
                    scoremsg += `${gitprofile.score}:gem:\n`;
                    break
                default:
                    gitmsg += `${gitprofile.github_name}\n`;
                    scoremsg += `${gitprofile.score}\n`;
                }
            if(process === leaderboard.length) {
                embed.addField('Git profile', gitmsg , true)
                embed.addField('Score', scoremsg , true)
                    .setFooter('Obtenez un score supérieur à 1000 pour être certifié Robot3T')
                resolve(embed)
            }
        });
    })
}


module.exports = commandLeaderboard;