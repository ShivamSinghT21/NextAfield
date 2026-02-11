import dotenv from "dotenv";

dotenv.config();

// =======================================
// ENVIRONMENT CONFIGURATION
// =======================================

export const ENV = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,

  // Database
  DB_URL: process.env.DB_URL || 
          process.env.MONGODB_URI || 
          process.env.MONGO_URI || 
          'mongodb://localhost:27017/nextafield',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB

  // Email (if needed later)
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // API Keys (if needed)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// =======================================
// VALIDATION
// =======================================

const requiredEnvVars = [
  'JWT_SECRET',
  'DB_URL'
];

// Check required variables in production
if (ENV.NODE_ENV === 'production') {
  requiredEnvVars.push('GOOGLE_CLIENT_ID');
  requiredEnvVars.push('FRONTEND_URL');
}

const missing = requiredEnvVars.filter(key => {
  const value = key === 'DB_URL' ? ENV.DB_URL : process.env[key];
  return !value || value === 'default_secret_change_this';
});

if (missing.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('\n💡 Create .env file with these variables\n');

  if (ENV.NODE_ENV === 'production') {
    process.exit(1); // Exit in production
  } else {
    console.warn('⚠️  Running in development mode without all env vars\n');
  }
}

// =======================================
// HELPER FUNCTIONS
// =======================================

export const isDevelopment = () => ENV.NODE_ENV === 'development';
export const isProduction = () => ENV.NODE_ENV === 'production';
export const isTest = () => ENV.NODE_ENV === 'test';

// Log environment on startup
if (isDevelopment()) {
  console.log('\n🔧 Environment Configuration:');
  console.log(`   NODE_ENV: ${ENV.NODE_ENV}`);
  console.log(`   PORT: ${ENV.PORT}`);
  console.log(`   DB_URL: ${ENV.DB_URL.substring(0, 30)}...`);
  console.log(`   JWT_SECRET: ${ENV.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   FRONTEND_URL: ${ENV.FRONTEND_URL}`);
  console.log('');
}

export default ENV;