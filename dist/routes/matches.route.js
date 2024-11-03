import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getMatches, getUserProfiles, swipeLeft, swipeRight, } from "../controllers/matches.controller";
const router = express.Router();
router.route("/swipe-right/:likedUserId").post(authMiddleware, swipeRight);
router.route("/swipe-left/:dislikedUserId").post(authMiddleware, swipeLeft);
router.route("/").get(authMiddleware, getMatches);
router.route("/user-profiles").get(authMiddleware, getUserProfiles);
export default router;
