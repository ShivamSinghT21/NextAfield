import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

// Import database connection
import { connectDB } from "./src/lib/db.js";

// Import routes
import authRoutes from "./src/routes/auth.js";
import communityRoutes from "./src/routes/community.js"; 

const app = express();

// -----------------------
// Basic Middleware
// -----------------------

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:4173",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    const method = req.method.padEnd(6);
    console.log(`[${timestamp}] ${method} ${req.path}`);
    next();
  });
}

// -----------------------
// Routes
// -----------------------

// Mount auth routes
app.use("/api/auth", authRoutes);

// Mount community routes
app.use("/api/communities", communityRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkyGrow API Server",
    status: "running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        register: "POST /api/auth/register (alias)",
        login: "POST /api/auth/login",
        googleLogin: "POST /api/auth/google-login",
        verify: "GET /api/auth/verify (protected)",
        me: "GET /api/auth/me (protected)",
        updateProfile: "PUT /api/auth/profile (protected)",
        logout: "POST /api/auth/logout (protected)",
        health: "GET /api/auth/health"
      },
      communities: {
        test: "GET /api/communities/test",
        create: "POST /api/communities/create (protected)",
        join: "POST /api/communities/join (protected)",
        joined: "GET /api/communities/joined (protected)",
        search: "GET /api/communities/search?q=term (protected)",
        getById: "GET /api/communities/:id (protected)",
        update: "PUT /api/communities/:id (protected, admin)",
        delete: "DELETE /api/communities/:id (protected, creator)",
        leave: "DELETE /api/communities/:id/leave (protected)",
        promote: "PUT /api/communities/:id/promote/:memberId (protected, admin)",
        demote: "PUT /api/communities/:id/demote/:memberId (protected, creator)",
        removeMember: "DELETE /api/communities/:id/members/:memberId (protected, admin)"
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
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    database: 'Connected',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "SkyGrow API",
    version: "1.0.0",
    documentation: `http://localhost:${process.env.PORT || 3000}/`,
    availableRoutes: [
      {
        path: "/api/auth",
        description: "Authentication and user management"
      },
      {
        path: "/api/communities",
        description: "Community garden management"
      }
    ]
  });
});

// -----------------------
// Error Handlers
// -----------------------

// 404 handler
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api",
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "POST /api/communities/create",
      "GET /api/communities/joined"
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error occurred:");
  console.error("   Path:", req.path);
  console.error("   Method:", req.method);
  console.error("   Error:", err.message);
  
  if (process.env.NODE_ENV === 'development') {
    console.error("   Stack:", err.stack);
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  
  res.status(statusCode).json({
    success: false,
    error: message,
    path: req.path,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

// -----------------------
// Start Server
// -----------------------

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/skygrow';

const startServer = async () => {
  try {
    console.log("\n🔄 Starting SkyGrow server...\n");

    // Check environment variables
    const requiredEnvVars = ['JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}\n`);
      console.error("💡 Create a .env file with:");
      missingVars.forEach(varName => {
        console.error(`   ${varName}=your_${varName.toLowerCase()}_here`);
      });
      console.error("");
      process.exit(1);
    }

    // Validate JWT_SECRET length
    if (process.env.JWT_SECRET.length < 32) {
      console.warn("⚠️  Warning: JWT_SECRET should be at least 32 characters long\n");
    }

    // Connect to database
    console.log("🔍 Connecting to MongoDB...");
    console.log(`   Database: ${DB_URL.split('@')[1] || 'localhost'}\n`);
    
    await connectDB(DB_URL);
    
    console.log("✅ MongoDB connected successfully\n");

    // Start server
    app.listen(PORT, () => {
      console.log("╔═══════════════════════════════════════╗");
      console.log("║   🌱 SkyGrow API Server             ║");
      console.log("╚═══════════════════════════════════════╝");
      console.log("");
      console.log(`📍 Server:      http://localhost:${PORT}`);
      console.log(`🗄️  Database:    Connected`);
      console.log(`🔐 Auth:        /api/auth/*`);
      console.log(`🌍 Communities: /api/communities/*`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log("");
      console.log("📋 Quick Test URLs:");
      console.log(`   • Root:          http://localhost:${PORT}/`);
      console.log(`   • Health:        http://localhost:${PORT}/health`);
      console.log(`   • API Info:      http://localhost:${PORT}/api`);
      console.log(`   • Auth Health:   http://localhost:${PORT}/api/auth/health`);
      console.log(`   • Communities:   http://localhost:${PORT}/api/communities/test`);
      console.log("");
      console.log("🔑 Authentication:");
      console.log(`   • Signup:        POST http://localhost:${PORT}/api/auth/signup`);
      console.log(`   • Login:         POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   • Get Profile:   GET http://localhost:${PORT}/api/auth/me`);
      console.log("");
      console.log("✅ Server ready! Happy gardening! 🌱\n");
    });

  } catch (error) {
    console.error("\n❌ Failed to start server:");
    console.error("   ", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   • Ensure MongoDB is running");
    console.error("   • Check .env file exists and has JWT_SECRET");
    console.error("   • Verify database connection string");
    console.error("   • Check if port", PORT, "is already in use");
    console.error("");
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error("🔴 MongoDB Connection Refused:");
      console.error("   • Start MongoDB: mongod");
      console.error("   • Or use MongoDB Atlas cloud database");
      console.error("");
    }
    
    process.exit(1);
  }
};

// -----------------------
// Process Event Handlers
// -----------------------

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('\n❌ Unhandled Promise Rejection:');
  console.error('   ', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('   ', err.stack);
  }
  console.error('\n🔄 Shutting down server...\n');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n❌ Uncaught Exception:');
  console.error('   ', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('   ', err.stack);
  }
  console.error('\n🔄 Shutting down server...\n');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received. Shutting down gracefully...');
  console.log('✅ Server closed successfully\n');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received (Ctrl+C). Shutting down gracefully...');
  console.log('✅ Server closed successfully\n');
  process.exit(0);
});

// -----------------------
// Start the server
// -----------------------
startServer();

export default app;
