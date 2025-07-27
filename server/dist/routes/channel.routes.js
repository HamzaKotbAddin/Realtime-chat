"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/channelRoutes.js
const express_1 = require("express");
const channel_controller_1 = require("../controllers/channel.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const channelRoutes = (0, express_1.Router)();
channelRoutes.post("/create-channel", auth_middleware_1.verifyToken, channel_controller_1.createChannel);
channelRoutes.get("/get-user-channels", auth_middleware_1.verifyToken, channel_controller_1.getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId", auth_middleware_1.verifyToken, channel_controller_1.getChannelMessages);
exports.default = channelRoutes;
