import { Elysia } from "elysia";
import authRoutes from "./auth/routes";
import pageRoutes from "./pages/routes";

const routes = new Elysia().use(authRoutes).use(pageRoutes);

export default routes;
