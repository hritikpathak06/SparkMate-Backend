import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
    try {
        const token = (await req.cookies.token) || req.headers.authorization;
        if (!token) {
            return res.status(400).json({
                success: false,
                msg: "Please login to continue",
            });
        }
        const decoded_user = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.userId = decoded_user.userId;
        next();
    }
    catch (error) { }
};
