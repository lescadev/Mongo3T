const { RichEmbed } = require('discord.js');
const sendMessage = require('./sendMessage');

const command = (client, message) => {
    if(message.content === "!command"){
        message.delete();
        let embed = new RichEmbed()
            .addField('!repo-add <nom du dépôt>', 'Permet d\'ajouter un dépôt à la liste d\'écoute')
            .addField('!repo-rm <nom du dépôt>' ,'Permet de supprimer un dépôt de la liste d\'écoute')
            .addField('!repo-list', 'Permet de lister les dépôts de la liste d\'écoute')
            .addField('!link <pseudo Github>', 'Permet d\'associer son compte Github à son compte Discord')
            .addField('!link-rm', 'Permet de supprimer l\'utilisateur Github associé à ce compte Discord')
            .addField('!rate', 'Affiche le nombre de rêquêtes encore possible sur l\'API et l\'heure du reset')
            .addField('!leaderboard <nom du dépôt>', 'Affiche le classement sur ce dépôt')
            .addField('!command', 'Affiche la liste des commandes de Robot3T')
            .setColor('#11A529');
        sendMessage(client, embed);
    }
}

module.exports = command;