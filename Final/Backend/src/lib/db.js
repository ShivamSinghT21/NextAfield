import mongoose from "mongoose";
import { ENV } from "./env.js";

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📡 Port: ${conn.connection.port}`);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

/**
 * Graceful Shutdown
 */
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB Disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed (App Terminated)");
  process.exit(0);
});

/**
 * Helper functions
 */
export const isConnected = () => mongoose.connection.readyState === 1;

export const getConnectionStatus = () => {
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  return states[mongoose.connection.readyState];
};
