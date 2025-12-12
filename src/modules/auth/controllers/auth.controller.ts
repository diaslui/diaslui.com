import { BunRequest } from "bun";
import { signInService } from "../services/auth.service";

export const signInController = async (req: BunRequest) => {
  const body: { email: string; password: string } = await req.json();
  const { email, password } = body;

  if (signInService.authenticate({ email, password })) {
    const token = signInService.tokenize({ email, password });
    console.log(token);
    req.cookies.set("token", token, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    //  secure: true,
      expires: 60 * 60 * 24 * 7,
    });


    return new Response(
    JSON.stringify({ ok: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
      },
    }
  );
  }

  return new Response(
    JSON.stringify({ error: "Invalid credentials", ok: false }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
