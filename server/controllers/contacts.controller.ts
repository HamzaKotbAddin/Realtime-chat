import { NextFunction, Request, Response } from "express"
import User from "../models/user.model.ts"
import mongoose from "mongoose";
import Message from "../models/messages.model.ts";


export const searchContact = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { searchTerm } = req.body
        if (!searchTerm || searchTerm ===  undefined) {
            return res.status(400).json({ error: "searchTerm is required" });
        }

        const sanitzedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(sanitzedSearchTerm, 'i');

const contacts = await User.find({
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




    } catch (error) {
        
        console.error("Error searching for contacts:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
}



export const getContactForDMList = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUserId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
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

    console.log("Aggregation result contacts:", contacts);

    res.json({ contacts });
  } catch (error) {
    console.error("Error in getContactForDMList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};