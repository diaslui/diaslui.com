import { prisma } from "../../../db/connection";
import { PostInputCreate } from "../../../generated/prismabox/Post";
import type { Static } from "elysia";

const postRepositories = {
  list: async ({ limit, cursor }: { limit: number; cursor: string }) => {
    return await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      omit: {
        content: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  create: async ({ post }: { post: Static<typeof PostInputCreate> }) => {
    try {
      const postCreated = await prisma.post.create({
        data: post,
      });
      return {
        post:postCreated,
        err: undefined,
      }
    } catch (e) {
      return {
        err: e
      };
    }
  },
};

export default postRepositories;
