import cloudinary from "../lib/cloudinary.js";

import Message from "../models/Message.js";
import User from "../models/user.js";
import {io, userSocketMap} from "../server.js"

//get all users except the logged in one, for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    //count number of msgs not seen
    const unseenMessages = {};
    const promises = filteredUser.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages > 0) {
        unseenMessages[user._id] = messages.length();
      }
    });
    await Promise.all(promises);
    res.json({
      success: true,
      users: filteredUser,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error getting the sidebar users~",
      error: error.message,
    });
  }
};

//get all msgs for selected users
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error fetching the messages~",
      error: error.message,
    });
  }
};

//api to mark msgs as seen using msg id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error marking the messages as seen~",
      error: error.message,
    });
  }
};

//send msgs to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //Emit the new msg to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error sending the messages~",
      error: error.message,
    });
  }
};
