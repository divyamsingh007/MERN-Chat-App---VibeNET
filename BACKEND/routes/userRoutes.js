import express from "express";

import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controller/userController.js";
import { protectRoutes } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.put("/update-profile", protectRoutes, updateProfile);

userRouter.get("/check", protectRoutes, checkAuth);

export default userRouter;