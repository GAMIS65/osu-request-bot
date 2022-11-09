import { ChatUserstate } from 'tmi.js';
import { client as tmiClient , getMapLinkFromMessage, getDiffFromMessage } from './twitch';
import { getMap } from './map-processor';

process.on('uncaughtException', function (err) {
    console.log(err.message);
});

tmiClient.connect().then(() => {
    console.log('Connected to Twitch!');
}).catch(console.error);

tmiClient.on('message', async (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
    const mapLink = getMapLinkFromMessage(message);
    if(!mapLink) return;

    const mapId = getDiffFromMessage(message);
    if(!mapId) return;

    const beatmap = await getMap(mapId);
    if(beatmap) console.log(`${tags['display-name']} requested ${beatmap.title} ${Math.round(beatmap.difficulty.rating * 100) / 100}* ${beatmap.bpm} BPM`);
})