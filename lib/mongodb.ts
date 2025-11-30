import mongoose from 'mongoose';

// Define the MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB using Mongoose
 * Returns a cached connection if available to prevent multiple connections
 * 
 * @returns Promise<typeof mongoose> - The Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if one is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    // Wait for connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error so next call can retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
