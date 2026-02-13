import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

// =======================================
// Generate JWT Token Helper
// =======================================
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { 
      id: userId, 
      userId: userId,
      role: role
    },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =======================================
// SIGNUP (Email + Password)
// =======================================
export const signup = async (req, res) => {
  try {
    console.log("📝 Signup request received:", { email: req.body.email, username: req.body.username });
    const { username, email, password, name } = req.body;

    // Validate input
    if (!email || !password || !username) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        success: false,
        message: "Username, email, and password are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters, numbers, and underscores"
      });
    }

    console.log("🔍 Checking for existing user...");
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email === email.toLowerCase() ? "Email" : "Username");
      return res.status(409).json({ 
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? "Email already registered" 
          : "Username already taken" 
      });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("💾 Creating new user in database...");
    const newUser = await User.create({
      name: name || username,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: 'local',
      isActive: true,
      role: "user",
      bio: "",
      avatar: ""
    });

    console.log("✅ User created successfully:", {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role
    });

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);

    console.log("🎫 JWT token generated");

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
        role: newUser.role,
        authProvider: newUser.authProvider,
        createdAt: newUser.createdAt
      }
    });

  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ 
      success: false,
      message: "Signup failed", 
      error: err.message 
    });
  }
};

// =======================================
// LOGIN (Email + Password)
// =======================================
export const login = async (req, res) => {
  try {
    console.log("🔑 Login request received:", { username: req.body.username });
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        success: false,
        message: "Username/email and password are required" 
      });
    }

    console.log("🔍 Looking for user in database...");
    // Find by email OR username
    const user = await User.findOne({ 
      $or: [
        { email: username.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    console.log("✅ User found:", { 
      id: user._id, 
      email: user.email,
      role: user.role
    });

    // Check if user has password (not Google-only account)
    if (!user.password) {
      console.log("❌ User has no password (Google login only)");
      return res.status(401).json({ 
        success: false,
        message: "Please login with Google" 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log("❌ User account is inactive");
      return res.status(401).json({ 
        success: false,
        message: "Account is inactive" 
      });
    }

    console.log("🔐 Verifying password...");
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    console.log("✅ Password verified");

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    console.log("🎫 JWT token generated for user:", user._id, "Role:", user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        authProvider: user.authProvider,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Login failed", 
      error: err.message 
    });
  }
};

// =======================================
// GOOGLE LOGIN (Signup + Login)
// =======================================
export const googleLogin = async (req, res) => {
  try {
    console.log("🔵 Google login request received");
    const { credential } = req.body;

    if (!credential) {
      console.log("❌ Missing Google credential");
      return res.status(400).json({ 
        success: false,
        message: "Missing Google credential" 
      });
    }

    console.log("🔐 Verifying Google ID token...");
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    console.log("✅ Google token verified for:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to retrieve email from Google account"
      });
    }

    console.log("🔍 Checking if user exists...");
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("💾 Creating new user from Google login...");
      
      // Generate unique username from email
      const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
      let username = baseUsername;
      let counter = 1;
      
      // Check if username exists, add number if needed
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        name: name || email.split("@")[0],
        username: username,
        email: email.toLowerCase(),
        avatar: picture,
        picture: picture,
        googleId,
        password: null,
        authProvider: 'google',
        isActive: true,
        role: "user",
        bio: ""
      });

      console.log("✅ New user created:", { 
        id: user._id, 
        email: user.email,
        username: user.username,
        role: user.role 
      });
    } else {
      console.log("✅ Existing user found:", { 
        id: user._id, 
        email: user.email,
        role: user.role 
      });
      
      // Update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      if (picture && !user.picture) {
        user.picture = picture;
      }
      if (!user.authProvider) {
        user.authProvider = 'google';
      }
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    console.log("🎫 JWT token generated for user:", user._id, "Role:", user.role);

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || picture,
        picture: user.picture || picture,
        bio: user.bio,
        role: user.role,
        authProvider: user.authProvider,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(500).json({
      success: false,
      message: "Google login failed",
      error: error.message,
    });
  }
};

// =======================================
// GET CURRENT USER
// =======================================
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    console.log('🔍 Fetching current user:', userId);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log('✅ User found:', user.email);

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        picture: user.picture,
        bio: user.bio,
        role: user.role,
        authProvider: user.authProvider,
        isActive: user.isActive,
        googleId: user.googleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message
    });
  }
};

// =======================================
// UPDATE USER PROFILE
// =======================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, username, bio, avatar } = req.body;

    console.log('🔍 Updating profile for user:', userId);

    // Validate required fields
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters'
      });
    }

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters'
      });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }

    // Check if username is already taken (by another user)
    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim(),
      _id: { $ne: userId }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Validate bio length
    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Bio must be less than 500 characters'
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        bio: bio?.trim() || '',
        avatar: avatar?.trim() || '',
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Profile updated successfully:', updatedUser.email);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        picture: updatedUser.picture,
        bio: updatedUser.bio,
        role: updatedUser.role,
        authProvider: updatedUser.authProvider,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// =======================================
// VERIFY TOKEN
// =======================================
export const verifyToken = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        picture: user.picture,
        role: user.role,
        bio: user.bio,
        authProvider: user.authProvider,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("❌ Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token"
    });
  }
};

// =======================================
// LOGOUT
// =======================================
export const logout = (req, res) => {
  console.log("🚪 Logout request received for user:", req.user?.email || 'Unknown');
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};
