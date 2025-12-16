import postRepositories from "../repositories/post.repositories";

const postControllers = {
  list: async ({ query }) => {
    const limit = Math.min(Number(query.limit) || 10, 100);
    const cursor = query.cursor;

    const posts = await postRepositories.list({
      limit,
      cursor,
    });

    let nextCursor: string | null = null;

    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    return {
      data: posts,
      nextCursor,
    };
  },
  create: async ({ body, status }) => {
    const { post, err } = await postRepositories.create({ post: body });

    if (err) {
      return status(400, {
        error: err
      })
    }

      return status(201, {
        ...post
      })
  },
};

export default postControllers;
