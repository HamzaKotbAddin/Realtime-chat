"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMessages = exports.getUserChannels = exports.createChannel = void 0;
const channel_model_1 = __importDefault(require("../models/channel.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await user_model_1.default.findById(userId);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized user ID" });
        }
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Channel name is required and must be a string" });
        }
        if (members.length === 0) {
            return res.status(400).json({ error: "Members must be a non-empty" });
        }
        const userVaildate = await user_model_1.default.find({ _id: { $in: members } });
        if (userVaildate.length !== members.length) {
            return res.status(404).json({ error: "some members are not vaild users" });
        }
        const newChannel = new channel_model_1.default({
            name,
            members,
            admins: userId
        });
        await newChannel.save();
        return res.status(200).json({ message: "Channel created successfully", channel: newChannel });
    }
    catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.createChannel = createChannel;
const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.userId);
        const channels = await channel_model_1.default.find({ $or: [{ admins: userId }, { members: userId }] }).sort({ updatedAt: -1 });
        for (const channel of channels) {
            console.log(channel.updatedAt);
        }
        return res.status(200).json({ channels });
    }
    catch (error) {
        console.error("Error getting user channels:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.getUserChannels = getUserChannels;
const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await channel_model_1.default.findById(channelId).populate({ path: "messages", populate: { path: "sender", select: "id email username image color" } });
        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }
        const messages = channel.messages;
        return res.status(200).json({ messages });
    }
    catch (error) {
        console.error("Error getting channel messages:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.getChannelMessages = getChannelMessages;
