import Message from "../models/Message";
import User from "../models/user";

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
