import { Elysia, t } from "elysia";

import { signInController } from "@/modules/auth/controllers/auth.controller";
import { renderEjs } from "@/modules/pages/services/pages.service";

const authRoutes = new Elysia({ prefix: "/auth" });

authRoutes.get("/login", async () => {
  const html = await renderEjs("admin/login");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
authRoutes.post("/login", signInController, {
  body: t.Object({ email: t.String(), password: t.String() }),
});

export default authRoutes;
