const mongoose = require('mongoose');
const Channel = require('../models/channel');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
    .then(console.log('Connected to the database!'))
    .catch((e: Error) => console.log(e));

export const addUser = (osuId: string, osuUsername: string, twitchUsername: string) => {
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

export const getChannelData = async (channelUsername: string) => {
    const result = await Channel.findOne({twitch_username: channelUsername});
    return result;
}

export const updateData = async (osuId: number, value: string | number) => {
    return null;
}

export const db = mongoose.connection;

