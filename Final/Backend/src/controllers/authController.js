import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

// ✅ Generate JWT Token Helper - Include role
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      id: userId, 
      userId: userId,
      role: role  // ✅ Add role to token
    },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ======================================================
   SIGNUP (Email + Password)
====================================================== */
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
      isVerified: false,
      role: "user",  // ✅ Changed from "student" to "user"
      skills: [],
      bio: "Aspiring software developer",
      location: "India"
    });

    console.log("✅ User created successfully:", {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role
    });

    // ✅ Generate JWT token with role
    const token = generateToken(newUser._id, newUser.role);

    console.log("🎫 JWT token generated");

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role  // ✅ Return role
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

/* ======================================================
   LOGIN (Email + Password)
====================================================== */
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
      role: user.role  // ✅ Log role
    });

    // Check if user has password (not Google-only account)
    if (!user.password) {
      console.log("❌ User has no password (Google login only)");
      return res.status(401).json({ 
        success: false,
        message: "Please login with Google" 
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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // ✅ Generate JWT token with role
    const token = generateToken(user._id, user.role);

    console.log("🎫 JWT token generated for user:", user._id, "Role:", user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role || "user"  // ✅ Return role (default "user")
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

/* ======================================================
   GOOGLE LOGIN (Signup + Login)
====================================================== */
export const googleLogin = async (req, res) => {
  try {
    console.log("🔵 Google login request received");
    const { credential } = req.body;

    if (!credential) {
      console.log("❌ Missing Google credential");
      return res.status(400).json({ 
        success: false,
        error: "Missing Google credential" 
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
      const baseUsername = email.split("@")[0].toLowerCase();
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
        googleId,
        password: null, // Google users don't need password
        isVerified: true,
        role: "user",  // ✅ Changed from "student" to "user"
        skills: [],
        bio: "Aspiring software developer",
        location: "India"
      });

      console.log("✅ New user created:", { 
        id: user._id, 
        email: user.email,
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
      user.lastLogin = new Date();
      await user.save();
    }

    // ✅ Generate JWT token with role
    const token = generateToken(user._id, user.role);

    console.log("🎫 JWT token generated for user:", user._id, "Role:", user.role);

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || picture,
        picture: picture,
        role: user.role || "user"  // ✅ Return role
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

/* ======================================================
   VERIFY TOKEN
====================================================== */
export const verifyToken = async (req, res) => {
  try {
    // User is already attached to req by authMiddleware
    const user = await User.findById(req.user.id).select("-password");

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
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,  // ✅ Include role
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        phone: user.phone
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

/* ======================================================
   LOGOUT
====================================================== */
export const logout = (req, res) => {
  console.log("🚪 Logout request received");
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};
