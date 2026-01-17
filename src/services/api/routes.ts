import { Router } from "express";
import { Request, Response } from "express";
import redis from "../../redis.js";
import youtube from "../../utils/youtube.js";

const router = Router();

router.get("/youtube/lastvideos", async (req: Request, res: Response) => {

    const videos = await youtube.getLastVideos({ videosCount: 3})
    
    res.json({
        videos
    });

});

router.get("/stats/:redisKey", async (req: Request, res: Response) => {
  const totalReqs = await redis.get("site:requests:" + req.params.redisKey).catch(() => 0);
  res.json({
    totalRequests: totalReqs,
  });
});

export default router;
