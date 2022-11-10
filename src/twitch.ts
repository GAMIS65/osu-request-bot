const tmi = require('tmi.js');
import { ChatUserstate } from 'tmi.js';
import { getMap } from './map-processor';
import { sendBanchoMessage } from './bancho';

const STREAMER_OSU_USERNAME = process.env.STREAMER_OSU_USERNAME;

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [process.env.STREAMER_CHANNEL_NAME] // TODO: Get channels from DB
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
    if(!beatmap) return;

    let minutes = Math.floor(beatmap.length.total / 60);
    let seconds = beatmap.length.total - minutes * 60;

    // This is temporary 
    //@ts-ignore
    await sendBanchoMessage(STREAMER_OSU_USERNAME, `[${viewerType}] ${tags['display-name']} > [${beatmap.approvalStatus}] [https://osu.ppy.sh/b/${mapId[0]} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]] (${Math.round(beatmap.difficulty.rating * 100) / 100}*, ${minutes}:${seconds}, ${beatmap.bpm} BPM)`);
})
