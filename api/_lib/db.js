import { config } from "./config.js";
import { MongoClient } from "mongodb";

let clientPromise;

export async function getDb() {
  if (!clientPromise) {
    const client = new MongoClient(config.mongodbUri, {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      appName: "ganpati-mandal-locator"
    });

    clientPromise = client.connect().catch((error) => {
      clientPromise = null;
      throw new Error(`MongoDB connection failed: ${error.message}`);
    });
  }

  const client = await clientPromise;
  return client.db(config.mongodbDb);
}
