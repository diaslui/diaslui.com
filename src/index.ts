import express from "express";
import process from "node:process";
import path from "path";
import { fileURLToPath } from "url";
import { Redis } from "@upstash/redis";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdir = path.join(__dirname, "..");

process.loadEnvFile(path.join(__rootdir, ".env"));

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const app = express();

app.use("/assets", express.static(path.join(__rootdir, "public")));
app.set("views", path.join(__rootdir, "views"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production'){
    next();
    return;
  }

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

app.get("/stats", async (req, res) => {
  const totalReqs = await redis.get("site:requests:total");

  res.json({
    totalRequests: totalReqs,
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});


app.get("/source", (req, res) => {
  res.redirect("https://github.com/diaslui/diaslui.com");
});

app.get("/links", (req, res) => {
  res.render("linktree");
});

if (process.env.NODE_ENV !== 'production'){
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
  });
}

export default app;