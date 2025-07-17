import { Router } from "express";
import { getContactForDMList, searchContact } from "../controllers/contacts.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";

const contactRouter = Router();


contactRouter.post("/search", verifyToken, searchContact);
contactRouter.get("/get-contacts-for-dm", verifyToken, getContactForDMList);


export default contactRouter;