import { Router } from "express";
import { Request, Response } from "express";
import redis from "../../redis.js";
import youtube from "../../utils/youtube.js";
import fetch from "node-fetch";
import crypto from "crypto";
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
    const data = await response.json() as any;

    const solutions = await Promise.all(
      data.map(async (item: any) => {
        const solutionResponse = await fetch(item.url, { headers });
        const solutionData = await solutionResponse.json() as any;
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

router.get("/codeforces/stats", async (req: Request, res: Response) => {
  try {
    const handle = process.env.CODEFORCES_HANDLE || "diaslui";
    const apiKey = process.env.CODEFORCES_API_KEY;
    const apiSecret = process.env.CODEFORCES_API_SECRET;

    const cacheKey = `site:codeforces:stats:v2:${handle}`;
    const cachedStats = await redis.get(cacheKey);

    if (cachedStats) {
      try {
        if (typeof cachedStats === 'string') {
          return res.json(JSON.parse(cachedStats));
        } else {
          // If the redis client already parsed it into an object
          return res.json(cachedStats);
        }
      } catch (e) {
        console.warn("Invalid CF cache data", e);
      }
    }

    const generateSigUrl = (methodName: string) => {
      if (!apiKey || !apiSecret) {
        return `https://codeforces.com/api/${methodName}?handle=${handle}`;
      }
      const time = Math.floor(Date.now() / 1000);
      const rand = Math.random().toString(36).substring(2, 8).padEnd(6, '0');
      
      const params: Record<string, any> = methodName === "user.info" 
        ? { apiKey, handles: handle, time } 
        : { apiKey, handle, time };
        
      const sortedParams = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
      const sigString = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;
      const hash = crypto.createHash('sha512').update(sigString).digest('hex');
      const apiSig = `${rand}${hash}`;
      
      return `https://codeforces.com/api/${methodName}?${sortedParams}&apiSig=${apiSig}`;
    };

    const statusUrl = generateSigUrl("user.status");
    const infoUrl = generateSigUrl("user.info");

    const [statusRes, infoRes] = await Promise.all([
      fetch(statusUrl),
      fetch(infoUrl)
    ]);

    if (!statusRes.ok || !infoRes.ok) {
      throw new Error(`Codeforces API Error: Status ${statusRes.status} | Info ${infoRes.status}`);
    }

    const statusData = await statusRes.json() as any;
    const infoData = await infoRes.json() as any;

    if (statusData.status !== "OK" || infoData.status !== "OK") {
      throw new Error("Codeforces API returned FAILED");
    }

    const submissions = statusData.result;
    const profile = infoData.result[0];
    
    const solvedProblems = new Set();
    const dailyCounts: Record<string, number> = {};
    
    const now = new Date();
    const oneYearAgoTime = now.getTime() - 365 * 24 * 60 * 60 * 1000;
    const oneMonthAgoTime = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    
    let solvedAllTime = 0;
    let solvedLastYear = 0;
    let solvedLastMonth = 0;
    
    const datesAllTime = new Set<string>();
    const datesLastYear = new Set<string>();
    const datesLastMonth = new Set<string>();

    submissions.forEach((sub: any) => {
        if (sub.verdict === 'OK') {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            const subTime = sub.creationTimeSeconds * 1000;
            
            const dateObj = new Date(subTime);
            const dateStr = dateObj.getFullYear() + "-" + 
                            String(dateObj.getMonth() + 1).padStart(2, '0') + "-" + 
                            String(dateObj.getDate()).padStart(2, '0');
            
            if (!solvedProblems.has(problemId)) {
                solvedProblems.add(problemId);
                solvedAllTime++;
                if (subTime >= oneYearAgoTime) solvedLastYear++;
                if (subTime >= oneMonthAgoTime) solvedLastMonth++;
                dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
            }
            
            datesAllTime.add(dateStr);
            if (subTime >= oneYearAgoTime) datesLastYear.add(dateStr);
            if (subTime >= oneMonthAgoTime) datesLastMonth.add(dateStr);
        }
    });

    const calculateMaxStreak = (datesSet: Set<string>) => {
        const sortedDates = Array.from(datesSet).sort();
        if (sortedDates.length === 0) return 0;
        
        let maxStreak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const prev = new Date(sortedDates[i-1]);
            const curr = new Date(sortedDates[i]);
            const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else if (diffDays > 1) {
                currentStreak = 1;
            }
        }
        return maxStreak;
    };

    const heatmap = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.getFullYear() + "-" + 
                        String(d.getMonth() + 1).padStart(2, '0') + "-" + 
                        String(d.getDate()).padStart(2, '0');
        
        heatmap.push({
            date: dateStr,
            count: dailyCounts[dateStr] || 0
        });
    }

    const statsResult = {
        profile: {
          handle: profile.handle,
          rating: profile.rating || 0,
          maxRating: profile.maxRating || 0,
          rank: profile.rank || "Unrated",
          maxRank: profile.maxRank || "Unrated",
          avatar: profile.avatar || ""
        },
        solved: {
            allTime: solvedAllTime,
            lastYear: solvedLastYear,
            lastMonth: solvedLastMonth
        },
        streaks: {
            allTime: calculateMaxStreak(datesAllTime),
            lastYear: calculateMaxStreak(datesLastYear),
            lastMonth: calculateMaxStreak(datesLastMonth)
        },
        heatmap
    };

    await redis.set(cacheKey, JSON.stringify(statsResult), { EX: 6 * 3600 });

    res.json(statsResult);
  } catch (error) {
    console.error("Error fetching Codeforces stats v2:", error);
    res.status(500).json({ error: "Failed to fetch Codeforces stats" });
  }
});

export default router;
