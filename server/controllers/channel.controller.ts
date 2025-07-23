import Channel from "../models/channel.model.ts";
import { Request, Response } from "express";
import User from "../models/user.model.ts";
import mongoose from "mongoose";


export const createChannel = async (req: Request, res : Response): Promise<any> => {
  try {

const { name, members  } = req.body

const userId = req.userId

const admin = await User.findById(userId)

  if (!userId) {
      return res.status(401).json({ error: "Unauthorized user ID" });
    }

if(!admin){
  return res.status(404).json({ error: "Admin not found" });
}
if (!name || typeof name !== "string") {
  return res.status(400).json({ error: "Channel name is required and must be a string" });
}

if (members.length === 0) {
  return res.status(400).json({ error: "Members must be a non-empty" });
}

const userVaildate = await User.find({_id:{$in:members}})

if(userVaildate.length !== members.length){
  return res.status(404).json({ error: "some members are not vaild users" });
}
const newChannel = new Channel({
  name,
  members,
  admins: userId
})

await newChannel.save()

return res.status(200).json({ message: "Channel created successfully", channel: newChannel })


  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  } 
};





export const getUserChannels = async (req: Request, res : Response): Promise<any> => {

  try {
const userId = new mongoose.Types.ObjectId(req.userId)
const  channels = await Channel.find({$or:[{admins:userId},{members:userId}]}).sort({ updatedAt: -1 })
  for (const channel of channels) {
      console.log(channel.updatedAt);
    }
    return res.status(200).json({ channels })
  } catch (error) {
    console.error("Error getting user channels:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });

  }
}