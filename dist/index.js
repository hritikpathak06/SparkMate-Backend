import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import matchRoutes from "./routes/matches.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./database/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import { seedUsers } from "./data/users";
import { createServer } from "http";
import { InitializeSocket } from "./socket/socket.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import { profileEnd } from "console";
const app = express();
const httpServer = createServer(app);
// const __dirname = process.cwd();
// const clientDistPath = path.join(__dirname, "../client/dist");
// app.use(express.static(clientDistPath));
// Port config
const port = process.env.PORT || 5000;
// Initialize socket
InitializeSocket(httpServer);
// DB config
connectDB();
// Middleware setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "100mb" }));
app.use(morgan("common"));
app.use(cookieParser());
// Connecting EndPoints
// app.use(express.static(path.join(__dirname, "../../client/build")));
// Routes setup
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/match", matchRoutes);
app.use("/api/v1/message", messageRoutes);
// app.use(express.static(path.join(__dirname, "client", "dist")));
// app.get("*", (req, res) => {
//   // res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
//   res.sendFile(path.join(clientDistPath, "index.html"));
// });
// sample server
app.get("/", (req, res) => {
    res.json({
        success: true,
        msg: "Server working",
    });
});
// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running successfully on the port:${port}`);
});
