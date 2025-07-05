import { Router, Request, Response, NextFunction } from "express";
import { signUp, login, getUserInfo } from "../controllers/auth.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";


const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/user-info", verifyToken, getUserInfo);

export default authRouter;

