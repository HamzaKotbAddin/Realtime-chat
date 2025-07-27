"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = connectToDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToDB() {
    const uri = process.env.MONGO_URI;
    if (!uri)
        throw new Error("MONGO_URI not defined in environment");
    try {
        await mongoose_1.default.connect(uri, {
            dbName: process.env.MONGO_DB_NAME || "chat-app",
        });
        console.log("✅ Connected to MongoDB");
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
