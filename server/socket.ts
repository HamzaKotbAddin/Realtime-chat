import { Server as SocketIOServer, Socket  } from "socket.io";
import { Server } from "http"

import Message from "./models/messages.model";
import User from "./models/user.model";
import Channel from "./models/channel.model";

interface MessagePayload {
    sender: string; 
    recipient?: string;
    content?: string;
    fileUrl?: string;
    messageType: "text" | "file";
    timeStamp?: Date;
    channelId?: string;

  }

const setupSocket = (server: Server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true
        },
    });

    const userSocketMap = new Map();
    
    const disconnect = (socket: Socket) => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

const sendMessage = async (
  message: MessagePayload,
  callback: (response: { status: "ok" | "error"; error?: string }) => void
) => {
  try {
    console.log("📨 Private message received:", message);
    console.log("📨 Sender ID:", message.sender);
    console.log("📨 Recipient ID:", message.recipient);

    const senderSocketId = userSocketMap.get(message?.sender);
    const recipientSocketId = userSocketMap.get(message?.recipient);

    console.log("📡 Sender socket ID:", senderSocketId);
    console.log("📡 Recipient socket ID:", recipientSocketId);

    const createMessage = await Message.create(message);
    console.log("🆕 Created message in DB:", createMessage);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "_id email username image color")
      .populate("recipient", "_id email username image color");

    console.log("📄 Populated message data:", messageData);

    if (!messageData?.sender || !messageData?.recipient) {
      console.warn("⚠️ Missing populated sender or recipient data");
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessages", messageData);
      console.log(`✅ Emitting to sender ${message.sender} on socket ${senderSocketId}`);
    }

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessages", messageData);
      console.log(`✅ Emitting to recipient ${message.recipient} on socket ${recipientSocketId}`);
    }

    callback({ status: "ok" });
    console.log("✅ Callback sent to client with status: ok");
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    callback({ status: "error", error: (error as Error).message });
  }
};

const sendChannelMessage = async (
  message: MessagePayload,
  callback: (response: { status: "ok" | "error"; error?: string }) => void
) => {
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
      .populate("sender", "_id email username image color")
      .exec();

    console.log("📄 Populated message data:", messageData);

    await Channel.findByIdAndUpdate(
      channelId,
      { $push: { messages: createMessage._id } },
      { new: true }
    );

    console.log(`🔗 Message added to channel ${channelId}`);

    const channel = await Channel.findById(channelId).populate("members admins");

    console.log("📡 Populated channel:", {
      id: channel?._id,
      members: channel?.members?.length,
      admins: channel?.admins?.length,
    });

    const finalData = { ...messageData?.toJSON(), channelId: channel?._id };

    if (channel && channel.members) {
      channel.members.forEach((member: any) => {
        const memberSocketID = userSocketMap.get(member._id.toString());
        if (memberSocketID) {
          console.log(`📤 Sending message to member [${member.username}] at socket ${memberSocketID}`);
          io.to(memberSocketID).emit("receive-channel-message", finalData);
        } else {
          console.warn(`⚠️ No socket found for member [${member.username}]`);
        }
      });

      channel.admins.forEach((admin: any) => {
        const adminSocketID = userSocketMap.get(admin._id.toString());
        if (adminSocketID) {
          console.log(`📤 Sending message to admin [${admin.username}] at socket ${adminSocketID}`);
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
    callback({ status: "error", error: (error as Error).message });
  }
};


    io.on("connection", (socket: Socket) => {

        
        const userId = socket.handshake.auth?.userId;


        if (userId && userId !== 'undefined') {
            userSocketMap.set(userId, socket.id);
            console.log(`👥 Currently connected users: ${userSocketMap.size}`);

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