import { Router } from "express";
import { searchContact } from "../controllers/contacts.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";

const contactRouter = Router();


contactRouter.post("/search", verifyToken, searchContact);


export default contactRouter;