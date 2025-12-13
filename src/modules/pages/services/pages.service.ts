import ejs from "ejs";
import { readFile } from "fs/promises";
import path from "path";


export const renderEjs = async (view, data = {}): Promise<string> => {
  const file = await readFile(
    path.join(import.meta.dir, "../../../../public/views/", `${view}.ejs`),
    "utf8"
  );
  return ejs.render(file, data);
};
