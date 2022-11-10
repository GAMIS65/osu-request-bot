const tmi = require('tmi.js');
import { ChatUserstate } from 'tmi.js';
import { getMap } from './map-processor';

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['gamis65'] // TODO: Get channels from DB
});

const getMapLinkFromMessage = (message: string): string | undefined  => {
    const linkRegex = '(https:\/\/osu\.ppy\.sh\/beatmapsets\/)(.+[0-9])';
    let map = '';

    if(message.match(linkRegex)) {
        // @ts-ignore
        return map = message.match(linkRegex);
    }
}

const getDiffFromMessage = (message: string): string | undefined => {
    const diffRegex = '(?<=#osu\/).*$';
    let map = message.match(diffRegex);
    // @ts-ignore
    return map[0];
}

const getViewerType = (viewer: ChatUserstate): string => {
    if(viewer.badges && viewer.badges.broadcaster) return 'Broadcaster';
    if(viewer.mod) return 'Mod';
    if(viewer.badges && viewer.badges.vip) return 'VIP';
    if(viewer.subscriber) return 'Sub';
    return 'Viewer';
}

const checkViewerPerms = (viewer: ChatUserstate, viewerType: string) => {
    // TODO: Add these things to DB
    let isBlacklisted = false; 
    let subOnly = false;

    if(isBlacklisted) return false;
    if(subOnly && viewerType === 'Viewer') return false; // TODO: Change this to check an array of allowed viewer types instead
    return true;
}

client.connect().then(() => {
    console.log('Connected to Twitch!');
}).catch(console.error);

client.on('message', async (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
    const mapLink = getMapLinkFromMessage(message);
    if(!mapLink) return;

    const viewerType = getViewerType(tags);
    const canViewerRequest = checkViewerPerms(tags, viewerType);
    if(!canViewerRequest) return;

    const mapId = getDiffFromMessage(message);
    if(!mapId) return;

    const beatmap = await getMap(mapId);
    if(beatmap) console.log(`[${viewerType}] ${tags['display-name']} requested ${beatmap.title} ${Math.round(beatmap.difficulty.rating * 100) / 100}* ${beatmap.bpm} BPM`);
})