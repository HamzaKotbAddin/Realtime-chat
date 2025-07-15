import { Router } from "express";
import { getMessages } from "../controllers/message.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";


const messageRouter = Router();


messageRouter.post("/get-messages", verifyToken, getMessages);


export default messageRouter;