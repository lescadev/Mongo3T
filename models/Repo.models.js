//Le schéma mongodb pour stocker les repository sur lesquels on veut "écouter"
const mongoose = require('mongoose');

const RepoSchema = mongoose.Schema({
    nom: {
        type: String,
        unique : true
    }
}, {timestamps: { createdAt: 'created_at' }});

module.exports = mongoose.model('Repo', RepoSchema);
