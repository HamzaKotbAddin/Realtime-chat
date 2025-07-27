"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContecats = exports.getContactForDMList = exports.searchContact = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const messages_model_1 = __importDefault(require("../models/messages.model"));
const searchContact = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm || searchTerm === undefined) {
            return res.status(400).json({ error: "searchTerm is required" });
        }
        const sanitzedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(sanitzedSearchTerm, 'i');
        const contacts = await user_model_1.default.find({
            $and: [
                { _id: { $ne: req.userId } }, // Exclude current user
                {
                    $or: [
                        { username: regex },
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex }
                    ]
                }
            ]
        }).select("username firstName lastName email image color");
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.error("Error searching for contacts:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.searchContact = searchContact;
const getContactForDMList = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const currentUserId = new mongoose_1.default.Types.ObjectId(userId);
        const contacts = await messages_model_1.default.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { sender: currentUserId },
                                { recipient: currentUserId }
                            ]
                        },
                        { $expr: { $ne: ["$sender", "$recipient"] } }
                    ]
                }
            },
            { $sort: { timeStamp: -1 } },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", currentUserId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timeStamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                    pipeline: [
                        { $project: { password: 0 } }
                    ]
                }
            },
            { $unwind: "$contactInfo" },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    username: "$contactInfo.username",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    email: "$contactInfo.email",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            { $sort: { lastMessageTime: -1 } }
        ]);
        res.json({ contacts });
    }
    catch (error) {
        console.error("Error in getContactForDMList:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getContactForDMList = getContactForDMList;
const getAllContecats = async (req, res) => {
    try {
        const users = await user_model_1.default.find({ _id: { $ne: req.userId } }, "username firstName lastName _id email");
        const contacts = users.map((user) => ({
            label: user.username ? `${user.username}` : user.email,
            value: user._id
        }));
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.error({ error });
        return res.status(500).json({ message: "internal server error" });
    }
};
exports.getAllContecats = getAllContecats;
