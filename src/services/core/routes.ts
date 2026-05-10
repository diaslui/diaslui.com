import { Router } from "express";
import { countVisitsMiddleware } from "./middlewares.js";
import { Request, Response } from "express";
import { splitMD } from "./utils.js";
import redis from "../../redis.js";
import fs from "fs";

const router = Router();
router.use(countVisitsMiddleware);

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});

router.get("/about", (req: Request, res: Response) => {
  res.render("about", {
    title: "About Me",
    description:
      "Learn more about Luis, a software developer passionate about coding and technology.",
  });
});

router.get("/articles", (req: Request, res: Response) => {
  res.render("articles", {
    title: "Articles",
    description: "Read articles about programming, technology, and more.",
  });
});

router.get("/competitive", (req: Request, res: Response) => {
  res.render("competitive", {
    title: "Competitive Programming",
    description: "My competitive programming library.",
  });
});

router.get("/problems", (req: Request, res: Response) => {
  res.render("problems", {
    title: "Solved Problems",
    description: "A list of solved problems from platforms like Codeforces.",
  });
});

router.get("/problems/:problemId", async (req: Request, res: Response) => {
  const problemId = req.params.problemId;

  let solutions;
  let cachedSolutions = await redis.get("github:solutions");

  if (cachedSolutions) {
    try {
      solutions = JSON.parse(String(cachedSolutions));
    } catch (parseError) {
      console.warn("Invalid cache data in core routes, fetching new...", parseError);
      cachedSolutions = null; 
    }
  }

  if (!cachedSolutions || !solutions) {
    const response = await fetch(
      `${req.protocol}://${req.get("host")}/api/solutions`
    );
    if (!response.ok) {
      return res.status(500).render("404"); 
    }
    solutions = await response.json();
  }

  const solution = solutions.find((s: any) => s.name === problemId);

  if (!solution) {
    return res.status(404).render("404");
  }

  const solutionContent = await fetch(solution.download_url).then((res) =>
    res.text()
  );

  res.render("solution", {
    title: `Solution for Codeforces ${solution.name}`,
    description: `C++ solution for Codeforces problem ${solution.name}`,
    solution: {
      ...solution,
      content: solutionContent,
    },
  });
});

router.get("/read/:postId", async (req: Request, res: Response) => {
  const url = `https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master/posts/${encodeURIComponent(
    req.params.postId.toString(),
  )}.md`;

  const articleRequest = await fetch(url);

  if (!articleRequest.ok) {
    res.status(404).render("404");
    return;
  }

  const md = await articleRequest.text();
  const result = splitMD(md);
  if (!result) {
    res.status(500).send("Failed to parse article");
    return;
  }
  const { header, body } = result;
  const thumb =
    "https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master" +
    header.image;

  header["imgUrl"] = thumb;

  if (process.env.NODE_ENV === "production") {
    redis.incr("site:requests:read:" + req.params.postId).catch(() => {});
  }

  res.render("read", {
    postId: req.params.postId,
    header,
    body: JSON.stringify(body),
  });
});

router.get("/source", (req: Request, res: Response) => {
  res.redirect("https://github.com/diaslui/diaslui.com");
});

router.get("/links", (req: Request, res: Response) => {
  res.render("linktree", {
    title: "Links",
    description: "Connect with me on various platforms.",
  });
});

router.get("/maps", (req: Request, res: Response) => {
  res.render("maps", {
    title: "Lui Maps",
    description:
      "Explore the places I've visited around the world - my personal travel timeline.",
  });
});

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://diaslui.com";
  const today = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>${baseUrl}/</loc>
<lastmod>${today}</lastmod>
<priority>1.0</priority>
</url>

<url>
<loc>${baseUrl}/articles</loc>
<lastmod>${today}</lastmod>
<priority>0.9</priority>
</url>

`;

  const articlesRes = await fetch(
    "https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master/posts/index.json",
  );

  const articles = await articlesRes.json();

  articles.forEach((article: { id: any; date: string | number | Date }) => {
    const url = `${baseUrl}/read/${article.id}`.toString().trim();
    sitemap += `<url>
<loc>${url}</loc>
<lastmod>${new Date(article.date).toISOString()}</lastmod>
<priority>0.8</priority>
</url>
`;
  });

  sitemap += `
  <url>
  <loc>${baseUrl}/linktree</loc>
  <lastmod>2026-01-10</lastmod>
  <priority>0.7</priority>
  </url>

  <url>
  <loc>${baseUrl}/about</loc>
  <lastmod>2026-01-10</lastmod>
  <priority>0.6</priority>
  </url>

  <url>
  <loc>${baseUrl}/competitive</loc>
  <lastmod>${today}</lastmod>
  <priority>0.8</priority>
  </url>

  <url>
  <loc>${baseUrl}/problems</loc>
  <lastmod>${today}</lastmod>
  <priority>0.8</priority>
  </url>
  `;

  // Adicionar dinamicamente as solucoes ao sitemap
  try {
    let solutions;
    let cachedSolutions = await redis.get("github:solutions");
    if (cachedSolutions) {
      solutions = JSON.parse(String(cachedSolutions));
    } else {
        const response = await fetch(`${req.protocol}://${req.get("host")}/api/solutions`);
        if (response.ok) {
            solutions = await response.json();
        }
    }

    if (solutions && Array.isArray(solutions)) {
      solutions.forEach((solution: any) => {
        const problemUrl = `${baseUrl}/problems/${solution.name}`.toString().trim();
        sitemap += `<url>
<loc>${problemUrl}</loc>
<lastmod>${today}</lastmod>
<priority>0.7</priority>
</url>\n`;
      });
    }
  } catch (err) {
    console.error("Error adding solutions to sitemap:", err);
  }

  sitemap += "</urlset>";

  res.setHeader("Content-Type", "application/xml");
  res.send(sitemap);
});

router.get("/robots.txt", (req: Request, res: Response) => {
  const robotsTxt =
    "User-agent: *\nDisallow:\nSitemap: https://diaslui.com/sitemap.xml\n";
  res.setHeader("Content-Type", "text/plain");
  res.send(robotsTxt);
});


export default router;
