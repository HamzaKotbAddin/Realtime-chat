// routes/channelRoutes.js
import { Router } from "express";
import { createChannel, getUserChannels } from "../controllers/channel.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);



export default channelRoutes;
