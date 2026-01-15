const youtube = {
  getLastVideos: async ({ videosCount }: { videosCount: number }) => {
    const ytApiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!ytApiKey) {
      return undefined;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${ytApiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${videosCount}&type=video`
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    if (!data.items) {
      return undefined;
    }
    return data.items;
  },
};

export default youtube;
