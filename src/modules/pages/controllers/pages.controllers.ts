import { serveStatic } from "../services/pages.service";

export const pageRoutes: {
  [key: string]: () => Response;
} = {
  "/": () => serveStatic("index"),
  "/about": () => serveStatic("about"),
  "/hello": () => serveStatic("hello"),
};
