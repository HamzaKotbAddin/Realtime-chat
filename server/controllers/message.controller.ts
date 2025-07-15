import { Request, Response } from "express";
import Message from "../models/messages.model.ts";


export const getMessages = async (req: Request, res: Response): Promise<any> => {
    try {
  
      const user1 = req.userId;
      const user2 = req.body.id;
  
  
  
      if (!user1 || !user2) {
        return res.status(400).json({ error: "Both Users are required" });
      }
  
  
      const messages = await Message.find({
        $or: [
          { sender: user1, recipient: user2 },
          { sender: user2, recipient: user1 },
        ],
      })
        .sort({ timeStamp: 1 })
        .populate("sender", "id username email image color")
        .populate("recipient", "id username email image color");
  

      return res.status(200).json({ messages });
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again later." });
    }
  };