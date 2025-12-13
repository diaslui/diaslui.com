import { Elysia } from "elysia";
import { initWorkers } from "./services/services";
import { staticPlugin } from "@elysiajs/static";
import servicesRoutes from "./services/routes";
import routes from "./modules/routes";
import { join } from "path";

const server = new Elysia()
  .listen(3000, () => {
    initWorkers();

    console.log(`running at http://localhost:${3000}`);
  })
  .use(routes)
  .use(servicesRoutes)
  .use(
    staticPlugin({
      assets: join(import.meta.dir, "../public"),
      prefix: "/assets",
    })
  );
