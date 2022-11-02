const tmi = require('tmi.js');
import { ChatUserstate } from 'tmi.js';

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['gamis65']
});

client.connect();

client.on('message', (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
    console.log(`${tags['display-name']}: ${message}`);
    
})