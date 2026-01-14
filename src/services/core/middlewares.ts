import { Request, Response, NextFunction } from "express";
import redis from "../../redis";

export const countVisitsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "production") {
    next();
    return;
  }

  res.on("finish", () => {
    if (res.statusCode < 400) {
      if (!req.path.startsWith("/assets")) {
        redis.incr("site:requests:total").catch(() => {});
      }
    }
  });

  next();
};