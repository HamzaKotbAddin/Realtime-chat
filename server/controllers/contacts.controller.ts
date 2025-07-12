import { NextFunction, Request, Response } from "express"
import User from "../models/user.model.ts"


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
              { _id: { $ne: req.userId } },            // Exclude current user
              {                                        // Match username OR email
                $or: [
                  { username: regex },
                  {firstName: regex},
                  {lastName: regex},
                  { email: regex }
                ]
              }
            ]
          });
        return res.status(200).json({ contacts });




    } catch (error) {
        
        console.error("Error searching for contacts:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
}