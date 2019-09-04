const sendMessage = (client, embed) => {
    client.channels.get(process.env.CHANNEL).send(embed);
}

module.exports = sendMessage;