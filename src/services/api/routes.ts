import { Router } from "express";
import { Request, Response } from "express";
import redis from "../../redis";
import youtube from "../../utils/youtube";

const router = Router();

router.get("/youtube/lastvideos", async (req: Request, res: Response) => {

    const videos = await youtube.getLastVideos({ videosCount: 3})
    
    res.json({
        videos
    });

});

router.get("/stats", async (req: Request, res: Response) => {
  const totalReqs = await redis.get("site:requests:total");

  res.json({
    totalRequests: totalReqs,
  });
});

export default router;
