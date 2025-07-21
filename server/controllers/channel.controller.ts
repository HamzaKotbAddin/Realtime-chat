import Channel from "../models/channel.model.ts";
import { Request, Response } from "express";


export const getChannels = async (req: Request, res : Response) => {
  try {
    const channels = await Channel.find().sort({ updatedAt: -1 }); // Sorted by latest update
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};