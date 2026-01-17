import { Router } from "express";
import { countVisitsMiddleware } from "./middlewares.js";
import { Request, Response } from "express";
import { splitMD } from "./utils.js";
import redis from "../../redis.js";

const router = Router();
router.use(countVisitsMiddleware);

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});

router.get("/about", (req: Request, res: Response) => {
  res.render("about");
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
  res.render("linktree");
});

export default router;
