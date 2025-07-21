import { Router } from "express";
import { getAllContecats, getContactForDMList, searchContact } from "../controllers/contacts.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";

const contactRouter = Router();


contactRouter.post("/search", verifyToken, searchContact);
contactRouter.get("/get-contacts-for-dm", verifyToken, getContactForDMList);
contactRouter.get("/get-all-contacts", verifyToken, getAllContecats );


export default contactRouter;