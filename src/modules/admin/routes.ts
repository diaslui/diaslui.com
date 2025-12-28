import { Elysia } from "elysia";
import { ejsResponse } from "../pages/services/pages.service";
import { allAuthTokenMiddleware } from "../auth/middlewares";

const adminRoutes = new Elysia({ prefix: "/admin" }).guard(
  {
    beforeHandle({ cookie, set }) {
      return allAuthTokenMiddleware({ cookie, set });
    },
  },
  (app) =>
    app.get("", ({ body }) => {
      return ejsResponse("admin/hub");
    })
);

export default adminRoutes;
