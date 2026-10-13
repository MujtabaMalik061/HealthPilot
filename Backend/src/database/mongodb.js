import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

let connectionPromise;

const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!DB_URI) throw new Error("Please define the DB_URI environment variable");

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 10000,
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  return connectionPromise;
};

export default connectToDB;
