import { Server as SocketIOServer, Socket  } from "socket.io";
import { Server } from "http"

import Message from "./models/messages.model.ts";

interface MessagePayload {
    sender: string; 
    recipient?: string;
    content?: string;
    fileUrl?: string;
    messageType: "text" | "file";
    timeStamp?: Date;
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

    const sendMessage = async (message: MessagePayload, callback: (response: { status: "ok" | "error"; error?: string }) => void ) => {
        try {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);
        console.log(createMessage._id);
        const messageData = await Message.findById(createMessage._id).populate("sender", "id email username image color").populate("recipient", "id email username image color");

        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessages", messageData);
        }
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessages", messageData);
        }
        callback({ status: "ok" });
    } catch (error) {
        
        callback({ status: "error", error: (error as Error).message });
    }

    }

    io.on("connection", (socket: Socket) => {

        
        const userId = socket.handshake.auth?.userId;


        if (userId && userId !== 'undefined') {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected. Socket ID: ${socket.id}`);

        } else {
            console.log(`User ID not provided or undefined. Received:`, userId);     
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));

});

    return io; // Return the io instance for potential use elsewhere
};

export default setupSocket;