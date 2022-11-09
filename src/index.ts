const Bancho = require("./bancho");
const Twitch = require("./twitch");

console.log('Attempting to connect to Twitch and Bancho...')

process.on('uncaughtException', function (err) {
    console.log(err.message);
});