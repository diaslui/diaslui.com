import { serveStatic } from "../pages/services/pages.service";
import { signInController } from "./controllers/auth.controller";

export const authRoutes = {
  "/login": {
    GET: serveStatic("admin/login"),
    POST: signInController,
  },
};
