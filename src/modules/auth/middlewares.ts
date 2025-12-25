import { tokenRepos } from "./repositories/session.repositories";
import { renderEjs } from "@/modules/pages/services/pages.service";

export const allAuthTokenMiddleware = async ({ cookie, set }) => {
  const sessionId = cookie.session_id.value;

  if (!sessionId) {
    const html = await renderEjs("system/unauthorized");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  const session = await tokenRepos.getSession({
    sessionId,
  });
  if (!session) {
    const html = await renderEjs("system/unauthorized");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const sessionExpiresDate = new Date(session.expiresAt);
  if (sessionExpiresDate <= new Date(Date.now())) {
    const html = await renderEjs("system/unauthorized");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

};
