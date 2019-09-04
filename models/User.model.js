//Le schéma mongodb pour créer les documents qui vont lier un utilisateur github à son pseudo discord
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    github: {
        type: String,
        unique : true
    },
    discord: {
        type: String,
        unique : true
    }
}, {timestamps: { createdAt: 'created_at' }});

module.exports = mongoose.model('User', UserSchema);