import Channel from "../models/channel.model";
import User from "../models/user.model";
import mongoose from "mongoose";
export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
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
        const userVaildate = await User.find({ _id: { $in: members } });
        if (userVaildate.length !== members.length) {
            return res.status(404).json({ error: "some members are not vaild users" });
        }
        const newChannel = new Channel({
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
export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({ $or: [{ admins: userId }, { members: userId }] }).sort({ updatedAt: -1 });
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
export const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId).populate({ path: "messages", populate: { path: "sender", select: "id email username image color" } });
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
