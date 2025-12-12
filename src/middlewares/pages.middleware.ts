import { pageRoutes } from "../modules/pages/controllers/pages.controllers";
import { BunRequest } from "bun";

export const pagesMiddleware = (req: BunRequest) => {
  const url = new URL(req.url);

  if (pageRoutes[url.pathname]) {
    return pageRoutes[url.pathname]();
  }
  return undefined;
};
