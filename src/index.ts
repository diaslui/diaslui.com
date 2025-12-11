import Bun from "bun";
import myReactSinglePageApp from "../views/index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": myReactSinglePageApp
  },
});

console.log(`running at http://localhost:${server.port}/`);
