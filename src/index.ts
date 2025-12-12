import Bun from "bun";
import { staticMiddleware } from "./middlewares/static.middleware";
import { pagesMiddleware } from "./middlewares/pages.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import routes from "./modules/routes";
import { getActualTrack } from "./services/lastfm/service";
import { initWorkers } from "./services/services";
import {servicesRoutes} from './services/routes'

const server = Bun.serve({
  port: 3000,
  async fetch(req: any) {
    const pages = pagesMiddleware(req);
    if (pages) {
      return pages;
    }
    const staticFiles = await staticMiddleware(req);
    if (staticFiles) {
      return staticFiles;
    }

    const authResponse = authMiddleware(req);
    if (authResponse) {
      return authResponse;
    }

    return new Response("404 Not Found", { status: 404 });
  },
  routes: {...servicesRoutes, ...routes},
});

initWorkers();

console.log(`running at http://localhost:${server.port}`);
