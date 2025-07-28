import { Request, Response } from "express";
import Message from "../models/messages.model";
import { mkdirSync, renameSync } from "fs"


export const getMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    
    console.log("📥 Fetching messages between:", user1, "and", user2);

    console.log("👉 req.body:", req.body);


    console.log("📨 Fetching messages between:", user1, "and", user2);

    if (!user1 || !user2) {
      console.warn("⚠️ Missing user IDs:", { user1, user2 });
      return res.status(400).json({ error: "Both Users are required" });
    }


    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    })
      .sort({ timeStamp: 1 })
      .populate("sender", "_id username email image color")
      .populate("recipient", "_id username email image color");

    console.log(`✅ Found ${messages.length} messages`);
    messages.forEach(msg => {
  if (!msg.sender || !msg.recipient) {
    console.warn("Found message with missing sender or recipient:", msg._id);
  }
});

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};




 export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      console.warn("⚠️ No file provided in request");
      return res.status(400).json({ error: "file is required" });
    }

    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`;

    console.log("📁 Creating directory:", fileDir);
    mkdirSync(fileDir, { recursive: true });

    console.log("📦 Moving file to:", fileName);
    renameSync(req.file.path, fileName);

    console.log("✅ File uploaded successfully:", fileName);
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};
