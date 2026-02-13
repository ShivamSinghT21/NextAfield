import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// =======================================
// PROTECT MIDDLEWARE - Verify JWT Token
// =======================================
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('🔐 Auth Middleware:', {
      hasAuthHeader: !!req.headers.authorization,
      hasToken: !!token,
      path: req.path,
      method: req.method
    });

    // Check if token exists
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token verified:', {
      userId: decoded.id || decoded.userId,
      role: decoded.role
    });

    // Get user from database (exclude password)
    const user = await User.findById(decoded.id || decoded.userId).select('-password');

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      console.log('❌ User account is inactive');
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    // Attach user to request
    req.user = user;

    console.log('✅ User authenticated:', {
      id: user._id,
      email: user.email,
      role: user.role,
      username: user.username
    });

    next();

  } catch (error) {
    console.error('❌ Auth error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// =======================================
// ADMIN MIDDLEWARE - Check if user is admin
// =======================================
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('✅ Admin access granted:', req.user.email);
    next();
  } else {
    console.log('❌ Admin access denied for:', req.user?.email || 'unknown');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// =======================================
// OPTIONAL AUTH - Don't fail if no token
// =======================================
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // No token, continue without user
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id || decoded.userId).select('-password');

    if (user && user.isActive !== false) {
      req.user = user;
      console.log('✅ Optional auth - User authenticated:', user.email);
    }

    next();

  } catch (error) {
    // Token invalid, continue without user
    console.log('⚠️ Optional auth - Invalid token, continuing without user');
    next();
  }
};

// =======================================
// EXPORT DEFAULT (for backward compatibility)
// =======================================
export default protect;
