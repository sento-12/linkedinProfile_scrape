const dotenv = require("dotenv")
dotenv.config()
const  express = require('express')
const app = express();
const cors = require('cors');
const connectToDb = require('./db/mongo.db')
const linkedinProfile = require("./model/linkedinProfile.model")
const scrapeProfile = require("./services/scrapeProfile.services")
const cron = require('node-cron');



connectToDb()
app.use(cors());
app.use(express.json());

app.get('/profile/:uid', async (req, res) => {
    const { uid } = req.params;
    const profileData = await scrapeProfile.scrapeLinkedInProfile(uid);

    if (profileData) {
        const existingProfile = await linkedinProfile.findOne({ uid });

        if (existingProfile) {
            await Profile.updateOne({ uid }, profileData);
        } else {
            const newProfile = new Profile(profileData);
            await newProfile.save();
        }

        res.json(profileData);
    } else {
        res.status(500).json({ error: 'Failed to scrape profile' });
    }
});

app.get('/profiles', async (req, res) => {
    const profiles = await Profile.find();
    res.json(profiles);
});


cron.schedule('0 0 1 */6 *', async () => {
    const profiles = await Profile.find();

    profiles.forEach(async (profile) => {
        const updatedData = await scrapeProfile.scrapeLinkedInProfile(profile.uid);
        if (updatedData) {
            await linkedinProfile.updateOne({ uid: profile.uid }, updatedData);
        }
    });

    console.log('Profiles updated successfully');
});


module.exports = app;

