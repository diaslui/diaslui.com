import { Router } from "express";
import {countVisitsMiddleware} from "./middlewares.js";
import { Request, Response } from "express";

const router = Router();
router.use(countVisitsMiddleware);

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});

router.get("/about", (req: Request, res: Response) => {
  res.render("about");
});

router.get("/read/:postId", (req: Request, res: Response) => {
  res.render("read", { postId: req.params.postId });
});

router.get("/source", (req: Request, res: Response) => {
  res.redirect("https://github.com/diaslui/diaslui.com");
});

router.get("/links", (req: Request, res: Response) => {
  res.render("linktree");
});

export default router;
