import { Elysia } from "elysia";
import { initWorkers } from "./services/services";
import servicesRoutes from "./services/routes";
import routes from "./modules/routes";
import { cookie } from "@elysiajs/cookie";
import {staticPlugin} from "@elysiajs/static";

new Elysia()
  .listen(
    {
      port: 3000,
      hostname: "0.0.0.0",
    },
    () => {
      initWorkers();
      console.log(`running at http://0.0.0.0:3000`);
    }
  )
  .use(cookie())
  .use(routes)
  .use(servicesRoutes)
  .use(staticPlugin({ assets: "public", prefix: "/assets" }));
