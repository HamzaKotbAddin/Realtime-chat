import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messages.model";
import Channel from "./models/channel.model";
const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();
  const disconnect = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const sendMessage = async (message, callback) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);
      const createMessage = await Message.create(message);
      console.log(createMessage._id);
      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email username image color")
        .populate("recipient", "id email username image color");
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessages", messageData);
      }
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessages", messageData);
      }
      callback({ status: "ok" });
    } catch (error) {
      callback({ status: "error", error: error.message });
    }
  };
  const sendChannelMessage = async (message, callback) => {
    try {
      console.log("📨 Incoming message payload:", message);
      const { channelId, sender, content, messageType, fileUrl } = message;
      const createMessage = await Message.create({
        channelId,
        sender,
        content,
        messageType,
        fileUrl,
        recipient: null,
        timeStamp: new Date(),
      });
      console.log("✅ Message created:", createMessage);
      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email username image color")
        .exec();
      console.log("📄 Populated message data:", messageData);
      await Channel.findByIdAndUpdate(
        channelId,
        { $push: { messages: createMessage._id } },
        { new: true }
      );
      console.log(`🔗 Message added to channel ${channelId}`);
      const channel = await Channel.findById(channelId).populate(
        "members admins"
      );
      console.log("📡 Populated channel:", {
        id: channel?._id,
        members: channel?.members?.length,
        admins: channel?.admins?.length,
      });
      const finalData = { ...messageData?.toJSON(), channelId: channel?._id };
      if (channel && channel.members) {
        channel.members.forEach((member) => {
          const memberSocketID = userSocketMap.get(member._id.toString());
          if (memberSocketID) {
            console.log(
              `📤 Sending message to member [${member.username}] at socket ${memberSocketID}`
            );
            io.to(memberSocketID).emit("receive-channel-message", finalData);
          } else {
            console.warn(`⚠️ No socket found for member [${member.username}]`);
          }
        });
        channel.admins.forEach((admin) => {
          const adminSocketID = userSocketMap.get(admin._id.toString());
          if (adminSocketID) {
            console.log(
              `📤 Sending message to admin [${admin.username}] at socket ${adminSocketID}`
            );
            io.to(adminSocketID).emit("receive-channel-message", finalData);
          } else {
            console.warn(`⚠️ No socket found for admin [${admin.username}]`);
          }
        });
      } else {
        console.warn("⚠️ Channel or members not found");
      }
      console.log("✅ Message sending complete");
      callback({ status: "ok" });
    } catch (error) {
      console.error("❌ Error in sendChannelMessage:", error);
      callback({ status: "error", error: error.message });
    }
  };
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId && userId !== "undefined") {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected. Socket ID: ${socket.id}`);
    } else {
      console.log(`User ID not provided or undefined. Received:`, userId);
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
  return io; // Return the io instance for potential use elsewhere
};
export default setupSocket;
