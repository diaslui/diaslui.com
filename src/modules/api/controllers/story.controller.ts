import storyRepositories from "../repositories/story.repositories";

const storyControllers = {
  list: async ({ query }) => {
    const limit = Math.min(Number(query.limit) || 10, 100);
    const cursor = query.cursor;

    const stories = await storyRepositories.list({
      limit,
      cursor,
    });

    let nextCursor: string | null = null;

    if (stories.length > limit) {
      const nextItem = stories.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: stories,
      nextCursor,
    };
  }
};

export default storyControllers;
