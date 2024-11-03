import Message from "../models/message.model";
import { getConnectedUsers, getIO } from "../socket/socket";

// Send Message
export const sendMessage = async (req: any, res: any) => {
  try {
    const { content, receiverId } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        msg: "Please write something",
      });
    }
    const newMessage = new Message({
      content,
      sender: req.userId,
      receiver: receiverId,
    });
    await newMessage.save();

    // Send the message in real-time (to do)
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const recieverSocketId = connectedUsers.get(receiverId.toString());
    if (recieverSocketId) {
      console.log("Emitting Message From: ",recieverSocketId)
      io.to(receiverId).emit("getMessage", {
        message: newMessage,
      });
    }
    return res.status(201).json({
      success: true,
      msg: "New Message Created",
      newMessage,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Get conversation
export const getConversation = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("receiver", "_id name image");
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
