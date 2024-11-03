import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getConversation, sendMessage, } from "../controllers/message.controller.js";
const router = express.Router();
router.route("/send").post(authMiddleware, sendMessage);
router.route("/conversation/:userId").get(authMiddleware, getConversation);
export default router;
