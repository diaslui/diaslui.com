import { prisma } from "../../../db/connection";



const storyRepositories = {

    list: async ({ limit, cursor }: { limit: number; cursor: string }) => {
    return await prisma.story.findMany({
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


}

export default storyRepositories;