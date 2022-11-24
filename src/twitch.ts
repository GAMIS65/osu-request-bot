const tmi = require('tmi.js');
import { ChatUserstate } from 'tmi.js';
import { getMap, checkMap } from './map-processor';
import { sendBanchoMessage } from './bancho';
import { getChannelData, getChannels } from './mongo';

async function run() {
	let twitchChannels = await getChannels();

    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        channels: twitchChannels
    });

    client.connect().then(() => {
        console.log('Connected to Twitch!');
    }).catch(console.error);

    const updateChannels = async (twitchChannels: Array<string>) => {
        let updatedChannels = await getChannels();
        updatedChannels = updatedChannels.map(i => '#' + i);

        if(twitchChannels.toString() !== updatedChannels.toString()) {
            client.channels = updatedChannels;
            client.opts.channels = updatedChannels;
            client.disconnect().then(() => client.connect()).catch((e: Error) => console.log(e));
        }
    }

    // Update channel list every minute
    setInterval(async function() {
        await updateChannels(client.opts.channels);
    }, 60000);
    
    client.on('message', async (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
        const mapLink = getMapLinkFromMessage(message);
        if(!mapLink) return;

        channel = channel.replace('#','');

        const channelData = await getChannelData(channel);
        
        // TODO: Create a channel interface
        // @ts-ignore
        if(!channelData.requests_enabled) return;

        const viewerType = getViewerType(tags);
        // @ts-ignore
        const canViewerRequest = checkViewerPerms(tags, viewerType, channelData.sub_only, channelData.viewer_blacklist);
        if(!canViewerRequest) return;
    
        const mapId = getDiffFromMessage(message);
        if(!mapId) return;
    
        const beatmap = await getMap(mapId);
        if(!beatmap) return;
        
        // @ts-ignore
        const validMap = await checkMap(beatmap, channelData.map_requirements);
        if(!validMap) return;
    
        let minutes = Math.floor(beatmap.length.total / 60);
        let seconds = beatmap.length.total - minutes * 60;

        await sendBanchoMessage(channelData.osu_username, `[${viewerType}] ${tags['display-name']} > [${beatmap.approvalStatus}] [https://osu.ppy.sh/b/${mapId[0]} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]] (${Math.round(beatmap.difficulty.rating * 100) / 100}*, ${minutes}:${seconds}, ${beatmap.bpm} BPM)`);
    })
}

run();

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

const checkViewerPerms = (viewer: ChatUserstate, viewerType: string, subOnly: boolean, blacklist: Array<string>) => {
    if(viewer.username && blacklist.includes(viewer.username)) return false;
    if(subOnly && viewerType === 'Viewer') return false;
    return true;
}
