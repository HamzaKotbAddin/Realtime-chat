import { Router, Request, Response, NextFunction } from "express";
import { signUp, login, getUserInfo, updateProfile } from "../controllers/auth.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";


const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/user-info", verifyToken, getUserInfo);
authRouter.put("/update-user-info", verifyToken, updateProfile);

export default authRouter;

