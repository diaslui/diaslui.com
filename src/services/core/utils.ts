const parseToJson = (str: string) => {
  if (!str) return {};
  const lines = str.split("\n");
  const result: Record<string, any> = {};

  lines.forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length > 0) {
      result[key.trim()] = rest
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
      if (result[key.trim()] === "true") {
        result[key.trim()] = true;
      } else if (result[key.trim()] === "false") {
        result[key.trim()] = false;
      } else if (!isNaN(Number(result[key.trim()]))) {
        result[key.trim()] = Number(result[key.trim()]);
      }
    }
  });

  return result;
};

export const splitMD = (
  md: string
): { header: Record<string, any>; body: string } | null => {
  const parts = md.split("---");
  let header = undefined;
  let body = undefined;

  if (parts.length < 3) {
    return null;
  }

  body = parts.slice(2).join("---").trim();
  header = parts[1].trim();

  return { header: parseToJson(header), body: body };
};
