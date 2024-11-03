import { Server } from "socket.io";
let io;
const connectedUser = new Map();
export const InitializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });
    // Extend Socket type to include userId property
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error("Invalid User Id"));
        }
        socket.userId = userId;
        next();
    });
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Store the user in the map if userId is present
        if (socket.userId) {
            connectedUser.set(socket.userId, socket.id);
            console.log("ConnectedUsers==>> ", connectedUser);
        }
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
            }
            else {
                console.log("Receiver not connected.");
            }
        });
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
        throw new Error("Socket io is not initialised");
    }
    return io;
};
export const getConnectedUsers = () => {
    return connectedUser;
};
