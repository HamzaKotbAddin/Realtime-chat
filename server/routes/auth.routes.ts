import { Router, Request, Response, NextFunction } from "express";
import { signUp, login } from "../controllers/auth.controller";


const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);

export default authRouter;

