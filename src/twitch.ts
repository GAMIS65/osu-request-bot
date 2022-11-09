const tmi = require('tmi.js');
import { ChatUserstate } from 'tmi.js';
import { getMap } from './map-processor';

export const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['gamis65'] // TODO: Get channels from DB
});

export const getMapLinkFromMessage = (message: string): string | undefined  => {
    const linkRegex = '(https:\/\/osu\.ppy\.sh\/beatmapsets\/)(.+[0-9])';
    let map = '';

    if(message.match(linkRegex)) {
        // @ts-ignore
        return map = message.match(linkRegex);
    }
}

export const getDiffFromMessage = (message: string): string | undefined => {
    const diffRegex = '(?<=#osu\/).*$';
    let map = message.match(diffRegex);
    // @ts-ignore
    return map[0];
}

client.connect().then(() => {
    console.log('Connected to Twitch!');
}).catch(console.error);

client.on('message', async (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
    const mapLink = getMapLinkFromMessage(message);
    if(!mapLink) return;

    const mapId = getDiffFromMessage(message);
    if(!mapId) return;

    const beatmap = await getMap(mapId);
    if(beatmap) console.log(`${tags['display-name']} requested ${beatmap.title} ${Math.round(beatmap.difficulty.rating * 100) / 100}* ${beatmap.bpm} BPM`);
})