import express from "express";
import process from "node:process";
import path from "path";
import { fileURLToPath } from "url";
import redis  from "./redis.js";
import apiRoutes from "./services/api/routes.js";
import coreRoutes from "./services/core/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdir = path.join(__dirname, "..");

process.loadEnvFile(path.join(__rootdir, ".env"));

redis.start(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
);
const app = express();

app.use("/assets", express.static(path.join(__rootdir, "public")));
app.set("views", path.join(__rootdir, "views"));
app.set("view engine", "ejs");
app.use("/api", apiRoutes);
app.use("/", coreRoutes);


if (process.env.NODE_ENV !== 'production'){
  app.listen(3000, () => {
    console.log(`running on http://localhost:3000`);
  });
}


app.use((req, res, next) => {
  res.status(404).render('404'); 
});


export default app;