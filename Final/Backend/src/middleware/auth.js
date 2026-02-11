import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    console.log('🔐 Auth Middleware - Header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header or invalid format');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🔐 Token received:', token.substring(0, 20) + '...');

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET || process.env.JWT_SECRET);
    
    console.log('✅ Token decoded successfully:', {
      id: decoded.id || decoded.userId,
      role: decoded.role,
      email: decoded.email
    });
    
    // Attach user info to request
    req.user = {
      id: decoded.id || decoded.userId,
      userId: decoded.userId || decoded.id,
      role: decoded.role || 'user',
      email: decoded.email
    };

    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export default authMiddleware;
