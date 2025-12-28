import { Elysia, t } from "elysia";
import { ejsResponse } from "./services/pages.service";

const staticPages: { [key: string]: string } = {
  "/": "index",
  "/about": "about",
  "/hello": "hello",
};

const pageRoutes = new Elysia();

for (const [route, view] of Object.entries(staticPages)) {
  pageRoutes.get(route, () => {
    return ejsResponse(view);
  });
}

export default pageRoutes;
