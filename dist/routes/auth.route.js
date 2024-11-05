import express from "express";
import { loginUser, logoutUser, myProfile, registerUser, } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authMiddleware, logoutUser);
router.route("/me").get(authMiddleware, myProfile);
export default router;
