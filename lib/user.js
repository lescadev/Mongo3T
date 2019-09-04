const { RichEmbed } = require('discord.js');
const User = require('../models/User.model');
const sendMessage = require('./sendMessage');

const commandUser = (client, message) => {
    if(message.content.startsWith('!link ')){
        message.delete();
        let data = {
            github: message.content.substr(6),
            discord: message.author.id
        }
        let user = new User(data);
        user.save().then(()=> {
            let embed = new RichEmbed()
                .setDescription(`L'utilisateur ${message.author.username}(discord) a été lié à ${data.github}(github)`)
                .setColor('#11A529')
            sendMessage(client, embed);
        }).catch(()=> {
            let embed = new RichEmbed()
                .setDescription(`Un problème est survenu`)
                .setColor('#9d0000');
            sendMessage(client, embed);
        });
    }
    if(message.content === "!link-rm") {
        message.delete();
        User.findOneAndDelete({discord: message.author.id}, (err, doc) => {
            let embed = new RichEmbed()
                .setDescription(`L'utilisateur ${message.author.username} n'est plus liée à un utilisateur Github`)
                .setColor('#11A529');
            sendMessage(client, embed);
        }).catch(()=> {
            let embed = new RichEmbed()
                .setDescription(`Un problème est survenu`)
                .setColor('#9d0000');
            sendMessage(client, embed);
        })
    }
}

module.exports = commandUser;