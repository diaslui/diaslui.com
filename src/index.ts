import Bun from "bun";
import { join } from "path";

const serveStatic = (html: string): Response => {
  const htmlFile = Bun.file(join(import.meta.dir, "public/" + html));
  return new Response(htmlFile, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};

const routes: {
  [key: string]: () => Response;
} = {
  "/": () => serveStatic("index.html"),
  "/about": () => serveStatic("about.html"),
  "/hello": () => serveStatic("hello.html"),
};

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    console.log(`Received request for ${url.pathname}`);

    if (routes[url.pathname]) {
      return routes[url.pathname]();
    }

    const staticPath = join(import.meta.dir, "public", url.pathname);
    const staticFile = Bun.file(staticPath);

    if (await staticFile.exists()) {
      return new Response(staticFile);
    }

    return new Response("404 Not Found", { status: 404 });
  },
});

console.log(`running at http://localhost:${server.port}`);
