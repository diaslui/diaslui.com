import { tokenRepos } from "./repositories/session.repositories";
import { ejsResponse } from "@/modules/pages/services/pages.service";

export const allAuthTokenMiddleware = async ({ cookie, set }) => {
  const sessionId = cookie.session_id.value;

  if (!sessionId) {
    return ejsResponse("system/unauthorized");
  }
  const session = await tokenRepos.getSession({
    sessionId,
  });
  if (!session) {
    return ejsResponse("system/unauthorized");
  }

  const sessionExpiresDate = new Date(session.expiresAt);
  if (sessionExpiresDate <= new Date(Date.now())) {
    return ejsResponse("system/unauthorized");
  }

};
