import jwt from "jsonwebtoken";

export const generateJWTToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "10d",
  });
};
