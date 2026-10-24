import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer;

export async function connectDB() {
  const configuredUri = process.env.MONGODB_URI?.trim();

  try {
    if (configuredUri) {
      await mongoose.connect(configuredUri);
      console.log('MongoDB connected using MONGODB_URI');
      return;
    }

    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('MongoDB connected to an in-memory MongoDB server for local development');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();

  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
