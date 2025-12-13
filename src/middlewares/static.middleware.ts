import { join } from "path";
import { BunRequest } from "bun";

const MIME_TYPES: { [key: string]: string } = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

export const staticMiddleware = async (req: BunRequest) => {
  const url = new URL(req.url);

  const staticPath = join(import.meta.dir, "../../public", url.pathname);
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

  return undefined;
};
