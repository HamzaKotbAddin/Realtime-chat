// routes/channelRoutes.js
import express from "express";
import { getChannels } from "../controllers/channel.controller.ts";

const router = express.Router();

router.get("/test-channels", getChannels);

export default router;
