const osu = require('node-osu');
import { Beatmap } from 'node-osu';

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

export const checkMap = (beatmap: Beatmap) => {
    // TODO: DB
    let MAX_SR = 0;
    let MIN_SR = 0;
    let MAX_LENGTH = 0;
    let isBlacklisted = false;

    if(isBlacklisted) return false;
    if(MAX_SR > 0 && Math.round(beatmap.difficulty.rating * 100) / 100 > MAX_SR) return false;
    if(Math.round(beatmap.difficulty.rating * 100) / 100 < MIN_SR) return false;
    if(MAX_LENGTH > 0 && beatmap.length.total > MAX_LENGTH) return false;
    return true;
}
