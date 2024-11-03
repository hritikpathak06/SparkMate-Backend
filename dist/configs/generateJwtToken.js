import jwt from "jsonwebtoken";
export const generateJWTToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: "10d",
    });
};
