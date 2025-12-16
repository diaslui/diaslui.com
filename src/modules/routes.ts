import { Elysia } from "elysia";
import authRoutes from "./auth/routes";
import pageRoutes from "./pages/routes";
import adminRoutes from "./admin/routes";
import apiRoutes from "./api/routes";

const routes = new Elysia().use(authRoutes).use(pageRoutes).use(adminRoutes).use(apiRoutes);

export default routes;
