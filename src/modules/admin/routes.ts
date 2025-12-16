import { Elysia, t } from "elysia";

import { renderEjs } from "../pages/services/pages.service";

const adminRoutes = new Elysia({ prefix: "/admin" });

adminRoutes.get("/posts", async () => {
  const html = await renderEjs("admin/posts");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    
    },
  });
});


export default adminRoutes;
