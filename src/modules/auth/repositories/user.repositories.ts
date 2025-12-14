import { prisma } from "../../../db/connection";

export const userRepos = {
  getUser: async (email: string, password: string) => {
    return prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
  },
};

export const authSessionRepos = {
  createSession: async (sessionId: string, userId: string, expiresAt: Date) => {
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        userId: userId,
        expiresAt: expiresAt,
      },
    });
    return session;
  },
};