import { BanchoMessage } from "bancho.js";
const Banchojs = require("bancho.js");
require('dotenv').config();

export const sendBanchoMessage = async(user: string, text: string) => {
	let recipient = await client.getUser(user);
	await recipient.sendMessage(text);
}

const client = new Banchojs.BanchoClient({ username: process.env.BOT_OSU_USERNAME, password: process.env.OSU_IRC_PASSWORD });
client.connect().then(() => {
	console.log('Connected to Bancho!');
}).catch(console.error);
