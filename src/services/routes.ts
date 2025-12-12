import { lastFmSseController } from "./lastfm/controller";

export const servicesRoutes = {
  "/lastfm/sse": {
    GET: lastFmSseController,
  },
};
