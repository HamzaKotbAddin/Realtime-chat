import mongoose from "mongoose";

export async function connectToDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not defined in environment");

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || "chat-app",
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); 
  }
}   