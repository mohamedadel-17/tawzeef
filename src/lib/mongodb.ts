import mongoose, { Mongoose } from "mongoose";

interface GlobalMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

// Environment check for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Caching logic
// The first time we run `mongoose`, it will be undefined, so we create it
// Then with any Save → we use the same connection from `global` instead of opening a new one
let cached = global.mongoose; 

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    // cached!.promise = mongoose.connect(MONGODB_URI).then((m) => m);
    cached!.promise = mongoose.connect(MONGODB_URI);
  }
  
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default connectDB;