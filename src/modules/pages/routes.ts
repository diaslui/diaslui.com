import { Elysia, t } from "elysia";
import { renderEjs } from "./services/pages.service";

const staticPages: { [key: string]: string } = {
  "/": "index",
  "/about": "about",
  "/hello": "hello",
};

const pageRoutes = new Elysia();

for (const [route, view] of Object.entries(staticPages)) {
  pageRoutes.get(route, async () => {
    const html = await renderEjs(view);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  });
}

export default pageRoutes;
