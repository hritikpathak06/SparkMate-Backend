import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

let io: Server | undefined;

// Map to keep track of connected users (userId -> socketId)
const connectedUser = new Map<string, string>();

export const InitializeSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_BASE_URL,
      credentials: true,
    },
  });

  // Extend Socket type to include userId property
  io.use((socket: Socket & { userId?: string }, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Invalid User Id"));
    }
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket: Socket & { userId?: string }) => {
    console.log(`User connected: ${socket.id}`);

    // Store the user in the map if userId is present
    if (socket.userId) {
      connectedUser.set(socket.userId, socket.id);
      console.log("Connected Users:", connectedUser);
    }

    // Handle incoming offer
    socket.on("offer", (data) => {
      const { offer, receiverId, senderId } = data;
      const receiverSocketId = connectedUser.get(receiverId);

      if (receiverSocketId) {
        io?.to(receiverSocketId).emit("offer", { offer, senderId });
        io?.to(receiverSocketId).emit("incomingCall", { senderId });
      } else {
        socket.emit("callFailed", { reason: "Receiver is not online" });
      }
    });

    socket.on("answer", (data) => {
      const { answer, receiverId, senderId } = data;
      const senderSocketId = connectedUser.get(senderId);

      if (senderSocketId) {
        io?.to(senderSocketId).emit("answer", { answer });
      }
    });

    socket.on("candidate", (data) => {
      const { candidate, receiverId, senderId } = data;
      const targetSocketId = connectedUser.get(receiverId);

      if (targetSocketId) {
        io?.to(targetSocketId).emit("candidate", { candidate });
      }
    });

    socket.on("endCall", (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUser.get(receiverId);

      if (receiverSocketId) {
        io?.to(receiverSocketId).emit("callEnded");
      }
    });

    socket.on("callRejected", (data) => {
      const { senderId } = data;
      const senderSocketId = connectedUser.get(senderId);

      if (senderSocketId) {
        io?.to(senderSocketId).emit("callFailed", { reason: "Call rejected" });
      }
    });

    // Handle sending a message
    socket.on("sendMessage", (message) => {
      const { content, sender, receiver } = message;
      const receiverSocketId = connectedUser.get(receiver);

      if (receiverSocketId) {
        console.log("Emitting 'getMessage' to receiver:", receiverSocketId);

        const newMessage = {
          content,
          sender,
          receiver,
          timestamp: new Date(),
        };

        // Emit the message to the receiver
        io?.to(receiverSocketId).emit("getMessage", newMessage);
      } else {
        console.log("Receiver not connected.");
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.userId) {
        connectedUser.delete(socket.userId);
      }
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

export const getConnectedUsers = () => {
  return connectedUser;
};
