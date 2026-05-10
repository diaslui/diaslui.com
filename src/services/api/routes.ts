import { Router } from "express";
import { Request, Response } from "express";
import redis from "../../redis.js";
import youtube from "../../utils/youtube.js";
import fetch from "node-fetch";

const router = Router();

router.get("/solutions", async (req: Request, res: Response) => {
  try {
    const cachedSolutions = await redis.get("github:solutions");
    if (cachedSolutions) {
      try {
        return res.json(JSON.parse(String(cachedSolutions)));
      } catch (parseError) {
        console.warn("Invalid cache data, fetching from GitHub...", parseError);
      }
    }

    const headers: HeadersInit = {};
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/repos/diaslui/competitive_programming/contents/codeforces",
      { headers }
    );
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }
    const data = await response.json();

    const solutions = await Promise.all(
      data.map(async (item: any) => {
        const solutionResponse = await fetch(item.url, { headers });
        const solutionData = await solutionResponse.json();
        const content = Buffer.from(solutionData.content, "base64").toString(
          "utf-8"
        );
        const firstLine = content.split("\n")[0];
        const problemUrlMatch = firstLine.match(
          /\s*\/\/\s*(https?:\/\/[^\s]+)/
        );
        const problemUrl = problemUrlMatch ? problemUrlMatch[1] : null;

        return {
          name: item.name.replace(".cpp", ""),
          path: item.path,
          download_url: item.download_url,
          problemUrl: problemUrl,
        };
      })
    );

    await redis.set("github:solutions", JSON.stringify(solutions), {
      EX: 3600,
    });

    res.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions from GitHub:", error);
    res.status(500).json({ error: "Failed to fetch solutions" });
  }
});

router.get("/youtube/lastvideos", async (req: Request, res: Response) => {

  const videos = await youtube.getLastVideos({ videosCount: 3 })

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
