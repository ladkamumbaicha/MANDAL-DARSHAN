import mongoose from "mongoose";

import {
  MONGODB_URI,
  DB_NAME
} from "./config.js";

export async function connectMongoDB() {

  try {

    await mongoose.connect(
      MONGODB_URI,
      {
        dbName: DB_NAME
      }
    );

    console.log(
      "MongoDB connected successfully"
    );

    console.log(
      `Database: ${DB_NAME}`
    );

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}