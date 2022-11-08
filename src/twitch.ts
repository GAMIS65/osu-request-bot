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
    let mapId = map[0];
    return mapId;
}