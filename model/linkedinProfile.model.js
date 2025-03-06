const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
    uid: String,
    name: String,
    headline: String,
    summary: String,
    experience: Array,
    education: Array,
    lastUpdated: Date,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile

