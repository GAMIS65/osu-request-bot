console.log('Attempting to connect to the Database, Twitch, and Bancho...')

const Mongo = require("./mongo")
const Bancho = require("./bancho");
const Twitch = require("./twitch");

process.on('uncaughtException', function (err) {
    console.log(err.message);
});
