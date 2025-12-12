import { join } from "path";

export const serveStatic = (html: string): Response => {
  const htmlFile = Bun.file(
    join(import.meta.dir, "../../../../public/views/" + html + ".html")
  );
  return new Response(htmlFile, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
