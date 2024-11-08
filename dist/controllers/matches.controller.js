import User from "../models/user.model.js";
import { getConnectedUsers, getIO } from "../socket/socket.js";
// Swipe Right
export const swipeRight = async (req, res) => {
    try {
        const { likedUserId } = req.params;
        const current_user = await User.findById(req.userId);
        const likedUser = await User.findById(likedUserId);
        if (!likedUser) {
            return res.status(404).json({
                success: false,
                msg: "user not found",
            });
        }
        if (!current_user?.likes.includes(likedUserId)) {
            current_user?.likes.push(likedUserId);
            await current_user.save();
        }
        // Check for a match
        if (likedUser.likes.includes(current_user._id)) {
            current_user.matches.push(likedUserId);
            likedUser.matches.push(current_user._id);
            await Promise.all([current_user.save(), likedUser.save()]);
            // Todo for match socket
            // Send a notification
            const connectedUsers = getConnectedUsers();
            const io = getIO();
            const likedUserSocketId = connectedUsers.get(likedUserId)?.toString();
            const currentUserSocketId = connectedUsers.get(current_user._id.toString());
            console.log("CurrentUserId===>> ", currentUserSocketId);
            console.log("Liked User Socket Id===>> ", likedUserSocketId);
            if (likedUserSocketId) {
                console.log(`Emitting new match to likedUser: ${likedUserSocketId}`);
                io.to(likedUserSocketId).emit("newMatch", {
                    _id: current_user._id,
                    name: current_user.name,
                    image: current_user.image,
                });
            }
            else {
                console.log(`likedUserSocketId not found for user ${likedUserId}`);
            }
            if (currentUserSocketId) {
                console.log(`Emitting new match to currentUser: ${currentUserSocketId}`);
                io.to(currentUserSocketId).emit("newMatch", {
                    _id: likedUser._id,
                    name: likedUser.name,
                    image: likedUser.image,
                });
            }
            else {
                console.log(`currentUserSocketId not found for user ${current_user._id}`);
            }
            return res.status(200).json({
                success: true,
                msg: "match",
                user: current_user,
            });
        }
        return res.status(200).json({
            success: true,
            msg: "liked",
            user: current_user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
// Swipe Left
export const swipeLeft = async (req, res) => {
    try {
        const { dislikedUserId } = req.params;
        const current_user = await User.findById(req.userId);
        if (current_user?.dislikes.includes(dislikedUserId)) {
            return res.status(400).json({
                success: false,
                msg: "User is already disliked",
            });
        }
        current_user.dislikes.push(dislikedUserId);
        await current_user.save();
        return res.status(200).json({
            success: true,
            msg: "passed",
            dislikedUserId,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
// Get all matches
export const getMatches = async (req, res) => {
    try {
        const current_user = await User.findById(req.userId).populate("matches");
        return res.status(200).json({
            sucecss: true,
            msg: "All matches listed here",
            matches: current_user?.matches,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
export const getUserMatches = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .populate("matches");
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "No User Found Associated with this id",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Fetched User Matches",
            matches: user.matches,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
// get all profiles
export const getUserProfiles = async (req, res) => {
    try {
        const current_user = await User.findById(req.userId);
        const users = await User.find({
            $and: [
                { _id: { $ne: current_user?._id } },
                { _id: { $nin: current_user?.likes } },
                { _id: { $nin: current_user?.dislikes } },
                { _id: { $nin: current_user?.matches } },
                {
                    gender: current_user?.genderPreference === "both"
                        ? { $in: ["male", "female"] }
                        : current_user?.genderPreference,
                },
                { genderPreference: { $in: [current_user?.gender, "both"] } },
            ],
        });
        return res.status(200).json({
            success: true,
            msg: "All user profiles fetched successfully",
            users,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
