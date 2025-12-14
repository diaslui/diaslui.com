import { v4 as uuid } from "uuid";
import { signInService, authSessionService } from "../services/auth.service";

export const signInController = async ({
  body,
  set,
  cookie,
}: {
  body: any;
  set: any;
  cookie: any;
}) => {
  const { email, password } = body; // i know i could add a real validator before T-T

  const user = await signInService.authenticate({ email, password });
  if (user) {
    const sessionId = uuid();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const session = await authSessionService.createSession(
      sessionId,
      user.id,
      expires
    );

    cookie.session_id.set({
      value: session.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
    });

    return {
      ok: true,
      session: session.id,
    };
  }

  return {
    ok: false,
  };
};
