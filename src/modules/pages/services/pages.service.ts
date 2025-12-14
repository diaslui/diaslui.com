import ejs from "ejs";
import { readFile } from "fs/promises";
import path from "path";


export const renderEjs = async (view, data = {}): Promise<string> => {
  const filePath = path.join(import.meta.dir, "../../../../public/views/", `${view}.ejs`);
  const file = await readFile(
    filePath,
    "utf8"
  );
  return ejs.render(file, data ,{
     filename: filePath,
  });
};
