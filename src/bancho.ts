import { BanchoMessage } from "bancho.js";
import { addUser, getChannels } from "./mongo";
const Banchojs = require("bancho.js");
require('dotenv').config();

export const sendBanchoMessage = async(user: string | number, text: string) => {
	let recipient = await client.getUser(user);
	await recipient.sendMessage(text);
}

const register = async (message: BanchoMessage, twitchUsername: string) => {
	try {
		// TODO: Verify twitch account
		if(twitchUsername) {
			await addUser(message.user.id, message.user.ircUsername, twitchUsername)
			await sendBanchoMessage(message.user.ircUsername, `Registered successfully! The bot will listen for requests in a minute or two. Type !help for help`);
		} else {
			await sendBanchoMessage(message.user.ircUsername, `You forgot to add your twitch username!`);
		}
	} catch (e: any) {
		if (e.code === 11000) return await sendBanchoMessage(message.user.ircUsername, `You are already registered! Type !help for help`);
		await sendBanchoMessage(message.user.ircUsername, `Something went wrong! ${e}`);
	}
}

const client = new Banchojs.BanchoClient({ username: process.env.BOT_OSU_USERNAME, password: process.env.OSU_IRC_PASSWORD });
client.connect().then(() => {
	console.log('Connected to Bancho!');
}).catch(console.error);

client.on('PM', async (message: BanchoMessage) => {
	const splitMessage = message.content.split(" ");
	switch (splitMessage[0]) {
		case '!help':
			await sendBanchoMessage(message.user.ircUsername, '[https://github.com/GAMIS65/osu-request-bot/blob/main/README.md#osu-request-bot List of commands]');
			break;

		case '!register':
			await register(message, splitMessage[1]);
			break;
		
		default:
			break;
	}
});
