"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.getMessages = void 0;
const messages_model_1 = __importDefault(require("../models/messages.model"));
const fs_1 = require("fs");
const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;
        if (!user1 || !user2) {
            return res.status(400).json({ error: "Both Users are required" });
        }
        const messages = await messages_model_1.default.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        })
            .sort({ timeStamp: 1 })
            .populate("sender", "id username email image color")
            .populate("recipient", "id username email image color");
        return res.status(200).json({ messages });
    }
    catch (error) {
        console.error("❌ Error fetching messages:", error);
        return res
            .status(500)
            .json({ error: "Something went wrong. Please try again later." });
    }
};
exports.getMessages = getMessages;
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "file is required" });
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`;
        (0, fs_1.mkdirSync)(fileDir, { recursive: true });
        (0, fs_1.renameSync)(req.file.path, fileName);
        return res.status(200).json({ filePath: fileName });
    }
    catch (error) {
        console.error("❌ Error uploading file:", error);
        return res
            .status(500)
            .json({ error: "Something went wrong. Please try again later." });
    }
};
exports.uploadFile = uploadFile;
