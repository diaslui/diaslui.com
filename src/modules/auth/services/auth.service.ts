import jwt from "jsonwebtoken";

export const signInService = {
  authenticate: (payload: { email: string; password: string }) => {
    if (
      payload.email == process.env.EMAIL_ADMIN &&
      payload.password == process.env.PASSWORD_ADMIN
    ) { // yes, this is repository mock
      return true;
    }

    return false;
  },
  tokenize: (payload: { email: string; password: string }) => {
    return jwt.sign({ email: payload.email }, process.env.JWT_SECRET);
  },
};
