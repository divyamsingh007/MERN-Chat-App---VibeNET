import express from "express";

import { protectRoutes } from "../middleware/auth";
import {
  getMessages,
  getUsersForSidebar,
} from "../controller/messageController";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoutes, getUsersForSidebar);
messageRouter.get("/:id", protectRoutes, getMessages);

messageRouter.put("mark/:id", protectRoutes, getMessages);

export default messageRouter;
