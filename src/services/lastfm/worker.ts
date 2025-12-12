import { getActualTrack } from "./service";
import { sendAllBySse } from "./controller";

export const lastfmWorker = () => {
  setInterval(async () => {
    const actualTrack = await getActualTrack();
    if (!actualTrack) {
      sendAllBySse({
        playing: false,
      });
      return;
    }
    sendAllBySse({
      playing: true,
      ...actualTrack,
    });
  }, 500);
};
