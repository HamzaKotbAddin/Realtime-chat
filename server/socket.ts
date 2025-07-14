import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server: any) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true
        },
    });

    const userSocketMap = new Map();
    
    const disconnect = (socket: any) => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    io.on("connection", (socket: any) => {

        
        const userId = socket.handshake.auth?.userId;


        if (userId && userId !== 'undefined') {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected. Socket ID: ${socket.id}`);

        } else {
            console.log(`User ID not provided or undefined. Received:`, userId);        }

        socket.on("disconnect", () => disconnect(socket));
    });

    return io; // Return the io instance for potential use elsewhere
};

export default setupSocket;