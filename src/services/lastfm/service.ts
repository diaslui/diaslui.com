export const getActualTrack = async () => {
  if (!process.env.LASTFM_API_KEY) {
    return undefined;
  }

  const response = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=scr6w&api_key=${process.env.LASTFM_API_KEY}&format=json`
  );

  const json: any = await response.json();
  const track = json.recenttracks.track[0];

  if (track["@attr"] && track["@attr"].nowplaying) {
    return {
      artist: track.artist["#text"],
      trackName: track.name,
      albumCover: track.image[2]["#text"],
      platform: "Spotify",
    };
  }

  return undefined;
};
