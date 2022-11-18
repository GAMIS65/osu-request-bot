const mongoose = require('mongoose');
const Channel = require('../models/channel');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
    .then(console.log('Connected to the database!'))
    .catch((e: Error) => console.log(e));

export const addUser = (osuId: number, osuUsername: string, twitchUsername: string) => {
    try {
        return Channel.create({
            osu_id: osuId,
            osu_username: osuUsername,
            twitch_username: twitchUsername
        });
    } catch (e) {
        return e;
    }
}

export const getChannels = async () => {
	let channels_arr: string[] = [];
    let channels = await Channel.find({}, {twitch_username: 1})
    channels.forEach(function(channel: any) {
        channels_arr.push(channel.twitch_username)
    });
    return channels_arr;
} 

export const getBeatmapRequirements = async (channel_username: string) => {
    channel_username = channel_username.replace('#','');
    const result = await Channel.findOne({twitch_username: channel_username});
    return result.map_requirements;
}

export const getOsuId = async (channel: string) => {
    let id = await Channel.findOne({twitch_username: channel}).exec();
    return id.osu_username;
}

export const db = mongoose.connection;

