import jwt from "jsonwebtoken";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = (await req.cookies.token) || req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        success: false,
        msg: "Please login to continue",
      });
    }

    const decoded_user: any = await jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET!
    );
    req.userId = (decoded_user as any).userId;
    next();
  } catch (error) {}
};
