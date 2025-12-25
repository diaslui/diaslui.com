import { Elysia } from "elysia";
import { renderEjs } from "../pages/services/pages.service";
import { allAuthTokenMiddleware } from "../auth/middlewares";

const adminRoutes = new Elysia({ prefix: "/admin" }).guard(
  {
    beforeHandle({ cookie, set }) {
      return allAuthTokenMiddleware({ cookie, set });
    },
  },
  (app) =>
    app.get("/posts", ({ body }) => {
      return renderEjs("admin/posts");
    })
);

export default adminRoutes;
