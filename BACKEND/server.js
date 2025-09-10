import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";

import { connectDB } from "./lib/db.js";

// Create Express app and https server
const APP = express();
const server = http.createServer(APP);

// Middleware Setup
APP.use(express.json({ limit: "4mb" }));
APP.use(cors());

//APIs
APP.use("/api/status", (req, res) => res.send("Server is live~"));

//Connect the databse
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}~`));
