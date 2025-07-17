import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend Express Request interface to include userId
 declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export const verifyToken =  (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.jwt;

    if (!token) {
     res.status(401).json({ error: "Unauthorized access" });
     return;
    }

    try {
        jwt.verify(token, process.env.JWT_Key as string, (error, payload) => {
            if (error) {
                console.error("Token verification error:", error);
                return res.status(401).json({ error: "Invalid token" });
            }
            req.userId = payload.userId;
            next();
        });
    } catch (error) {
        console.error("Token verification error:", error);
         res.status(401).json({ error: "Invalid token" });
         return;
    }

}
