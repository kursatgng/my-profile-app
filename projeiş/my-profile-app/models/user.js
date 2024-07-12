const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    birthdate: Date,
    profilePicture: String,
    linkedin: String,
    twitter: String,
    github: String
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
