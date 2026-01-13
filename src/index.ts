import express from "express";
import process from "node:process";
import path from "path";
import { fileURLToPath } from "url";
import { Redis } from "@upstash/redis";
process.loadEnvFile(".env");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdir = path.join(__dirname, "..");

const PORT = 3000;
const server = express();

server.use("/assets", express.static(path.join(__rootdir, "public")));
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.use((req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode < 400) {
      if (!req.path.startsWith("/assets")) {
        if (req.path !== "/stats") {
          redis.incr("site:requests:total").catch(() => {});
        }
      }
    }
  });

  next();
});

server.get("/stats", async (req, res) => {
  const totalReqs = await redis.get("site:requests:total");

  res.json({
    totalRequests: totalReqs,
  });
});

server.get("/", (req, res) => {
  res.render("index");
});

server.get("/links", (req, res) => {
  res.render("linktree");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on 0.0.0.0:${PORT}`);
});
