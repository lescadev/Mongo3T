const axios = require('axios');
const sendMessage = require('./sendMessage');
const { RichEmbed } = require('discord.js');
const PullRequest = require('../models/PullRequest.models');
const Repo = require('../models/Repo.models');
const User = require('../models/User.model');

const requestGit = (client) => {
    let intervalID = setInterval(async ()=> {

        let docs = await repoList();
        
        docs.forEach((doc)=>{
            request(client, doc.nom);
        })
 
    }, 20000);
}

const alreadySend = (id) => {
    return new Promise((resolve, reject)=> {
        let res;
        PullRequest.findOne({
            requestid: id
        }, (err, doc) => {
            if (doc === null){
                res = false;
            } else {
                res = true
            }
            resolve(res);    
        });
    })
}

const repoList = () => {
    return new Promise((resolve, reject)=> {
        Repo.find({}, (res, docs)=> {
            resolve(docs);
        })
    })
}

const linkUser = (gitUser) => {
    return new Promise((resolve, reject)=> {
        User.find({github: gitUser}, (res, doc)=> {
            resolve(doc);
        })
    })
}

const userToMention = (element) => {
    return new Promise((resolve, reject)=> {
        let listReviewer = "";
        let process = 0;
        element.requested_reviewers.forEach(async(reviewer)=> {
            let discordUser = await linkUser(reviewer.login);
            process++;
            if(discordUser.discord !== undefined){
                listReviewer += `<@${discordUser.discord}>`;
            } else {
                listReviewer += `@${reviewer.login}`;
            }
            if (process === element.requested_reviewers.length){
                resolve(listReviewer);
            }
        })
    })
}

const request = (client, repo) => {
    axios.get(`https://api.github.com/repos/${process.env.ORGA}/${repo}/pulls?client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}`)
    .then(async (response) => {
        response.data.forEach(async (element) => {

            const res = await alreadySend(element.id);

            if(!res){
                let embed = new RichEmbed()
                .setAuthor(`Nouvelle Pull Request sur ${repo}`, client.user.avatarURL)
                .setURL(element.html_url)
                .setTitle(element.title)
                .setColor('#11A529')
                .setTimestamp();

                let listReviewer = await userToMention(element);

                embed.setDescription(element.body + '\n' + listReviewer)

                const discordUser = await linkUser(element.user.login);
                if(client.users.get(discordUser[0].discord)){
                    embed.setFooter(client.users.get(discordUser[0].discord).username, client.users.get(discordUser[0].discord).avatarURL);
                } else {
                    embed.setFooter(element.user.login);
                }
                
            sendMessage(client, embed);

            let pull = new PullRequest({
                requestid: element.id
            });

            pull.save();

            }
        });
    }).catch(()=> {
        console.log('Request failed');
      });
}

module.exports = requestGit;
