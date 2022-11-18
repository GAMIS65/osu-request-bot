import { BanchoMessage } from "bancho.js";
import { addUser, getChannels } from "./mongo";
const Banchojs = require("bancho.js");
require('dotenv').config();

export const sendBanchoMessage = async(user: string | number, text: string) => {
	let recipient = await client.getUser(user);
	await recipient.sendMessage(text);
}

const client = new Banchojs.BanchoClient({ username: process.env.BOT_OSU_USERNAME, password: process.env.OSU_IRC_PASSWORD });
client.connect().then(() => {
	console.log('Connected to Bancho!');
}).catch(console.error);

client.on('PM', async (message: BanchoMessage) => {
	const splitMessage = message.content.split(" ");
	if(splitMessage[0] === '!register') {
		try {
			if(splitMessage[1]) {
				await addUser(message.user.id, message.user.ircUsername, splitMessage[1])
				await sendBanchoMessage(message.user.ircUsername, `Registered successfully! The bot will listen for requests in a minute or two. Type !help for help`);
			} else {
				await sendBanchoMessage(message.user.ircUsername, `You forgot to add your twitch username!`);
			}
		} catch (e: any) {
			if (e.code === 11000) return await sendBanchoMessage(message.user.ircUsername, `You are already registered! Type !help for help`);
			await sendBanchoMessage(message.user.ircUsername, `Something went wrong! ${e}`);
		}
	}
});
