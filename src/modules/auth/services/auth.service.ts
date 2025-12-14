import { prisma } from "../../../db/connection";
import { userRepos, authSessionRepos } from "../repositories/user.repositories";

export const signInService = {
  authenticate: async (payload: { email: string; password: string }) => {
    const user = await userRepos.getUser(payload.email, payload.password);
    if (!user) {
      return undefined;
    }

    return user;
  },
};

export const authSessionService = {
  createSession: async (sessionId: string, userId: string, expiresAt: Date) => {
    const session = await authSessionRepos.createSession(sessionId, userId, expiresAt);
    return session;
  },
};
