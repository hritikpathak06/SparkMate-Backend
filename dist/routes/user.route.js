import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller";
const router = express.Router();
router.route("/update-profile").put(authMiddleware, updateUserProfile);
router.route("/profile/:id").get(authMiddleware, getUserProfile);
export default router;
