import { Elysia, t } from "elysia";

import { signInController } from "./controllers/auth.controller";
import { renderEjs } from "../pages/services/pages.service";

const authRoutes = new Elysia({ prefix: "/auth" });

authRoutes.get("/login", async () => {
    const html = await renderEjs("admin/login");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
});
authRoutes.post("/login", {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  }),
}, signInController);

export default authRoutes;
