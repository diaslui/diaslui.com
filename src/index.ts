import Bun from "bun";
import { join } from "path";

const serveStatic = (html: string): Response => {
  const htmlFile = Bun.file(join(import.meta.dir, "../public/views/" + html));
  return new Response(htmlFile, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};

const MIME_TYPES: { [key: string]: string } = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
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
  routes: {
    "/login": {
      GET: () => serveStatic("admin/login.html"),
      POST: async (req) => {
        const body: { email: string; password: string } = await req.json();
        const { email, password } = body;

        if (email === "admin@admin.com" && password === "password") {
          const cookies = req.cookies;
          cookies.set("session", "2332", {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true,
            path: "/login",
            expires: 60 * 60 * 24 * 7,
          });
          return Response.json({
            ok: true,
          });
        } else {
          return new Response(
            JSON.stringify({ error: "Invalid credentials", ok:false }),
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    },
  },

  async fetch(req) {
    const url = new URL(req.url);

    if (routes[url.pathname]) {
      return routes[url.pathname]();
    }

    const staticPath = join(import.meta.dir, "../public", url.pathname);
    const ext = url.pathname.substring(url.pathname.lastIndexOf("."));
    if (MIME_TYPES[ext]) {
      const staticFileWithType = Bun.file(staticPath);
      if (await staticFileWithType.exists()) {
        return new Response(staticFileWithType, {
          headers: {
            "Content-Type": MIME_TYPES[ext],
          },
        });
      }
    }

    return new Response("404 Not Found", { status: 404 });
  },
});

console.log(`running at http://localhost:${server.port}`);
