import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Create Express app and https server
const APP = express();
const server = http.createServer(APP);

//Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

//Store online users
export const userSocketMap = {}; // {userId: socketId}

//Socket.io connection handler
io.on("connection", (socket)=> {
    const userId= socket.handshake.query.userId

    if(userId) userSocketMap[userId] = socket.id

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        console.log(`User disconnected: ${userId}`)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys[userSocketMap])
    })
})

// Middleware Setup
APP.use(express.json({ limit: "4mb" }));
APP.use(cors());

//APIs
APP.use("/api/status", (req, res) => res.send("Server is live~"));
APP.use("/api/auth", userRouter);
APP.use("/api/messages", messageRouter);

//Connect the databse
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}~`));
