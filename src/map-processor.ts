const osu = require('node-osu');
import { Beatmap } from 'node-osu';
import { getBeatmapRequirements } from './mongo';

require('dotenv').config();

const osuApi = new osu.Api(process.env.OSU_API_TOKEN, {
	notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
	completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
	parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
});


export const getMap = async (mapId: string): Promise<Beatmap> => {
    let beatmap;
    return osuApi.getBeatmaps({ b: mapId }).then((beatmaps: Array<Beatmap>) => {
        return beatmaps[0];
    });
}

export const checkMap = async (beatmap: Beatmap, channel_username: string) => {
    const map_requirements = await getBeatmapRequirements(channel_username);
    const MAX_SR = map_requirements.MAX_SR;
    const MIN_SR = map_requirements.MIN_SR;
    const MAX_LENGTH = map_requirements.MAX_LENGTH;
    const blacklist = map_requirements.map_blacklist;

    if(blacklist.includes(beatmap.beatmapSetId)) return false; // Check if map is blacklisted
    if(MAX_SR > 0 && Math.round(beatmap.difficulty.rating * 100) / 100 > MAX_SR) return false; // Check if its SR is higher than MAX_SR
    if(Math.round(beatmap.difficulty.rating * 100) / 100 < MIN_SR) return false; // Check if its SR is lower than MIN_SR
    if(MAX_LENGTH > 0 && beatmap.length.total > MAX_LENGTH) return false; // Check if map is longer than MAX_LENGTH
    return true;
}
