import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
const router = express.Router();
router.route("/update-profile").put(authMiddleware, updateUserProfile);
router.route("/profile/:id").get(authMiddleware, getUserProfile);
export default router;
