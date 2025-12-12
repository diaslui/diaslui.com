import { pageRoutes } from "../modules/pages/controllers/pages.controllers";
import { BunRequest } from "bun";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: BunRequest) => {
  const token = (req.headers.get("cookie") || "")
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];
  console.log(token);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    console.log("valid token");
  } catch (e) {
      console.log("invalid token");
    return new Response("Forbbiden", { status: 403 });
  
  }
};
