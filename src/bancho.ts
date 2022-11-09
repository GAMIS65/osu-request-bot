import { BanchoMessage } from "bancho.js";
const Banchojs = require("bancho.js");
require('dotenv').config();

const client = new Banchojs.BanchoClient({ username: process.env.OSU_USERNAME, password: process.env.OSU_IRC_PASSWORD });
client.connect().then(() => {
	console.log('Connected to Bancho!');
}).catch(console.error);

client.on("PM", (message : BanchoMessage) => console.log(`${message.user.ircUsername}: ${message.message}`));