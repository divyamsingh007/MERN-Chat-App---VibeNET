import jwt from "jsonwebtoken";
import User from "../models/user.js";

//Middleware to protect routes
export const protectRoutes = async (req, res, next) => {
  try {
    const token = req.header.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.json({ success: false, message: "User not found~" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message)
    return res.json({ success: false, message: "Error occured in finding user~", error: error.message })
  }
};
