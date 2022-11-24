import { BanchoMessage } from "bancho.js";
import { getUserId } from "./map-processor";
import { addUser, updateData } from "./mongo";
const Banchojs = require("bancho.js");
require('dotenv').config();

export const sendBanchoMessage = async(user: string | number, text: string) => {
	let recipient = await client.getUser(user);
	await recipient.sendMessage(text);
}

const register = async (message: BanchoMessage, userId: string, twitchUsername: string) => {
	try {
		// TODO: Verify twitch account
		if(twitchUsername) {
			await addUser(userId, message.user.ircUsername, twitchUsername);
			await sendBanchoMessage(message.user.ircUsername, `Registered successfully! The bot will listen for requests in a minute or two. Type !help for help`);
		} else {
			await sendBanchoMessage(message.user.ircUsername, `You forgot to add your twitch username!`);
		}
	} catch (e: any) {
		if (e.code === 11000) return await sendBanchoMessage(message.user.ircUsername, `You are already registered! Type !help for help`);
		await sendBanchoMessage(message.user.ircUsername, `Something went wrong! ${e}`);
	}
}

const updateSettings = async (message: BanchoMessage, userId: string, field: string, value: string) => {
	try {
		if(field && value){
			await updateData(userId, field, value);
		} else {
			await sendBanchoMessage(message.user.ircUsername, `You forgot to type a field that you want to update!`);
		}
	} catch (e: any) {
		await sendBanchoMessage(message.user.ircUsername, e);
	}
}

const client = new Banchojs.BanchoClient({ username: process.env.BOT_OSU_USERNAME, password: process.env.OSU_IRC_PASSWORD });
client.connect().then(() => {
	console.log('Connected to Bancho!');
}).catch(console.error);

client.on('PM', async (message: BanchoMessage) => {
	const splitMessage = message.content.split(" ");
	let userId: string;
	switch (splitMessage[0]) {
		case '!help':
			await sendBanchoMessage(message.user.ircUsername, '[https://github.com/GAMIS65/osu-request-bot/blob/main/README.md#osu-request-bot List of commands]');
			break;

		case '!register':
			userId = await getUserId(message.user.ircUsername); // Moved this here just in case someone spams messages
			await register(message, userId, splitMessage[1]);
			break;

		case '!subonly':
			let value = splitMessage[1].toLowerCase();
			userId = await getUserId(message.user.ircUsername);
			if(value === 'on') {
				value = 'true'
			} else if(value === 'off') {
				value = 'false'
			} else {
				await sendBanchoMessage(message.user.ircUsername, `This option can only be either 'on' or 'off'`);
				break;
			}
			await updateSettings(message, userId, 'sub_only', value);
			await sendBanchoMessage(message.user.ircUsername, `Sub only is now ${splitMessage[1].toLowerCase()}`);
			break;
		
		case '!set':
			userId = await getUserId(message.user.ircUsername);
			await updateSettings(message, userId, splitMessage[1], splitMessage[2]);
			break;
		
		default:
			break;
	}
});
