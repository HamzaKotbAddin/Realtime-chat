import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/database.js";
import authRouter from "./routes/auth.routes";
import contactRouter from "./routes/contact.routes";
import setupSocket from "./socket";
import messageRouter from "./routes/message.routes";
import channelRoutes from "./routes/channel.routes";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
console.log(port);
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("✅ API is running");
});
app.use("/api/auth", authRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/messages", messageRouter);
app.use("/api/channel", channelRoutes);
async function main() {
    await connectToDB();
    const server = app.listen(port, () => {
        console.log(`✅ Server is running at http://localhost:${port}, accepting requests from ${process.env.ORIGIN}`);
    });
    setupSocket(server);
}
main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
