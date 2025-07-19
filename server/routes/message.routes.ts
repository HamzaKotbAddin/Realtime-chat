import { Router } from "express";
import { getMessages, uploadFile } from "../controllers/message.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import multer from "multer";


const messageRouter = Router();

const upload = multer({ dest: "uploads/files/" });

messageRouter.post("/get-messages", verifyToken, getMessages);
messageRouter.post("/upload-file", verifyToken, upload.single("file"), uploadFile);


export default messageRouter;