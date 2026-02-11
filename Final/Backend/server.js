import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

// Import database connection
import { connectDB } from "./src/lib/db.js";

// Import auth routes
import authRoutes from "./src/routes/auth.js";

const app = express();

// -----------------------
// Basic Middleware
// -----------------------

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// -----------------------
// Routes
// -----------------------

// Mount auth routes
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NextAfield API Server",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        googleLogin: "POST /api/auth/google-login",
        verify: "GET /api/auth/verify",
        me: "GET /api/auth/me",
        health: "GET /api/auth/health"
      }
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// -----------------------
// Error Handlers
// -----------------------

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Route not found",
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});

// -----------------------
// Start Server
// -----------------------

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/nextafield';

const startServer = async () => {
  try {
    console.log("\n🔄 Starting server...\n");

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env file\n");
      process.exit(1);
    }

    // Connect to database
    console.log("🔍 Connecting to MongoDB...");
    await connectDB(DB_URL);
    console.log("✅ MongoDB connected\n");

    // Start server
    app.listen(PORT, () => {
      console.log("╔═══════════════════════════════════════╗");
      console.log("║   🚀 NextAfield API Server          ║");
      console.log("╚═══════════════════════════════════════╝");
      console.log("");
      console.log(`📍 Server:    http://localhost:${PORT}`);
      console.log(`🗄️  Database:  Connected`);
      console.log(`🔐 Auth:      /api/auth/*`);
      console.log("");
      console.log("✅ Server ready!\n");
    });

  } catch (error) {
    console.error("\n❌ Failed to start:");
    console.error("   ", error.message);
    console.error("\n💡 Check:");
    console.error("   • MongoDB is running");
    console.error("   • .env file exists");
    console.error("   • JWT_SECRET is set\n");
    process.exit(1);
  }
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});

// Start
startServer();

export default app;