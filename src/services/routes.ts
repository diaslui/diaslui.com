import { Elysia } from "elysia";

import { createSseResponse } from "./lastfm/controller";

const servicesRoutes = new Elysia().get("/lastfm/sse", () => createSseResponse());

export default servicesRoutes;
