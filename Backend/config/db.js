import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careertwin';
  
  try {
    // Attempt connecting to provided MONGO_URI with a short serverSelectionTimeoutMS
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to external MongoDB (${err.message}). Starting embedded MongoMemoryServer...`);
    try {
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start embedded MongoDB:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
