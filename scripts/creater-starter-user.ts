import { prisma } from "../src/db/connection";

const createStarterUser = async () => {
  const email = process.env.STATER_USER_EMAIL;
  const password = process.env.STATER_USER_PASSWORD;
  const displayName = process.env.STATER_USER_DISPLAY_NAME || "Starter User";
  const username = process.env.STATER_USER_USERNAME;

  if (!email || !password || !username) {
    console.error(
      "STATER_USER_EMAIL, STATER_USER_PASSWORD, and STATER_USER_USERNAME environment variables are required."
    );
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("starter user already exists.");
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: password,
      displayName: displayName,
      username: username,
    },
  });

  console.log("starter user created:");
};

createStarterUser();
