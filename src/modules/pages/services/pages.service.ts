import ejs from "ejs";
import { readFile } from "fs/promises";
import path from "path";

export const ejsResponse = async (view, data = {}): Promise<Response> => {
  const filePath = path.join(import.meta.dir, "../../../../views/", `${view}.ejs`);
  const file = await readFile(
    filePath,
    "utf8"
  );

   return new Response(ejs.render(file, data ,{
     filename: filePath,
  }), {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
