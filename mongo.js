import mongoose from "mongoose";
import { MONGODB_URI, DB_NAME } from "./config.js";

let connected = false;

export async function connectMongoDB() {
  if (connected && mongoose.connection.readyState === 1) return mongoose.connection;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000
    });
    connected = true;
    console.log(`MongoDB connected successfully: ${DB_NAME}`);
    return mongoose.connection;
  } catch (error) {
    connected = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}
