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

router.get("/read/:postId", async (req: Request, res: Response) => {
  const url = `https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master/posts/${encodeURIComponent(
    req.params.postId.toString()
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

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://diaslui.com";
  const today = new Date().toISOString().split("T")[0];

  let sitemap =
`<?xml version="1.0" encoding="UTF-8"?>
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
    "https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master/posts/index.json"
  );

  const articles = await articlesRes.json();

  articles.forEach(article => {
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
  `;

  sitemap += "</urlset>";

  res.setHeader("Content-Type", "application/xml");
  res.send(sitemap);
});

router.get("/robots.txt", (req: Request, res: Response) => {
  const robotsTxt = "User-agent: *\nDisallow:\nSitemap: https://diaslui.com/sitemap.xml\n";
  res.setHeader("Content-Type", "text/plain");
  res.send(robotsTxt);
});

export default router;
