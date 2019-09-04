//Dans le dossier /lib ça sera tous les fichiers qui apportent une fonctionnalité au bot
//Par exemple les commandes qu'il va pouvoir lire ou les messages de nouvelles pull request
const Repo = require('../models/Repo.models');
const sendMessage = require('./sendMessage');
const { RichEmbed } = require('discord.js');

const commandRepo = (client, message) => {
        if(message.content.startsWith('!repo-add ')){
            message.delete();
            let embed = new RichEmbed()
            let doc = new Repo({
                nom: message.content.substr(10)});
            doc.save().then(()=> {
                embed.setDescription(`Le dépôt ${message.content.substr(10)} a été ajouté`)
                .setColor('#11A529');
                sendMessage(client, embed);
            }).catch(error => {
                embed.setDescription(`Le dépôt ${message.content.substr(10)} existe déja`)
                .setColor('#9d0000');
                sendMessage(client, embed);
            });
        }
        if(message.content.startsWith('!repo-list')){
            message.delete();
            let embed = new RichEmbed()
                .setTitle('Liste des dépôts ajoutés');
            let list = "";
            repoList().then((value)=>{
                value.forEach(element => {
                    list += element.nom + '\n'
                });
                embed.setDescription(list);
                embed.setColor('#11A529');
                sendMessage(client, embed);
            })
        }
        if(message.content.startsWith('!repo-rm ')){
            message.delete()
            let embed = new RichEmbed()
            Repo.deleteOne({nom: message.content.substr(9)}, (err, res)=> {
                if(res) {
                    embed.setDescription(`Le dépôt ${message.content.substr(9)} a été supprimé`)
                        .setColor('#11A529');
                    sendMessage(client, embed);
                } else if (err) {
                    embed.setDescription(`Le dépôt ${message.content.substr(9)} n'a pas pu être supprimé'`)
                        .setColor('#9d0000');
                    sendMessage(client, embed);
                }
        })
    }
}

const repoList = () => {
    return new Promise((resolve, reject)=> {
        Repo.find({}, (err, docs)=> {
            resolve(docs);
        })
    })
}

module.exports = commandRepo;