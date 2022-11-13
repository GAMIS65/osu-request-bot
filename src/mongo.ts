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
	let channels = await Channel.find({}, function(e: Error, channels: Array<string>) {
	
		channels.forEach(function(channel) {
			// @ts-ignore
			channels_arr.push(channel.twitch_username)
		});
	}).clone();
	return channels_arr;
} 

export const getOsuId = async (channel: string) => {
    let id = await Channel.findOne({twitch_username: channel}).exec();
    return id.osu_username;
}

export const db = mongoose.connection;

