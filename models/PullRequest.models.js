//Le schéma mongodb pour stocker les pull request où un message a deja été envoyé
const mongoose = require ('mongoose');

const PullRequestSchema = mongoose.Schema({
    requestid : {
        type: String
    }
}, {timestamps: { createdAt: 'created_at' }});

module.exports = mongoose.model('PullRequest', PullRequestSchema);
