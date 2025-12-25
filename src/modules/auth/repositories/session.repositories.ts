import { prisma } from "../../../db/connection";

export const tokenRepos = {
  getSession: async ({ sessionId }: { sessionId: string }) => {
    try {
      return await prisma.session.findFirst({
        where: {
          id: sessionId,
        },
      });
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },
};
