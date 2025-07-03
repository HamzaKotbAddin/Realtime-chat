import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/database";
import authRouter from "./routes/auth.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter); // MOUNT ROUTES BEFORE LISTEN

await connectToDB();

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
