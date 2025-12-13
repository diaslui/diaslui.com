import { signInService } from "../services/auth.service";

export const signInController = async (ctx: any) => {
  const { username, password } = await ctx.body();

  console.log(`Attempting sign-in for user: ${username}`);
};
