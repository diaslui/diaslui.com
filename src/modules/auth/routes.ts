import { Elysia, t } from "elysia";

import { signInController } from "@/modules/auth/controllers/auth.controller";
import { ejsResponse } from "@/modules/pages/services/pages.service";

const authRoutes = new Elysia({ prefix: "/auth" });

authRoutes.get("/login", async () => {
  return ejsResponse("admin/login");
});
authRoutes.post("/login", signInController, {
  body: t.Object({ email: t.String(), password: t.String() }),
});

export default authRoutes;
