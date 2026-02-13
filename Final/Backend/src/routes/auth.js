import express from "express";
import { 
  signup, 
  login, 
  googleLogin, 
  verifyToken, 
  logout,
  getCurrentUser,
  updateProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// =======================================
// PUBLIC ROUTES
// =======================================
router.post("/signup", signup);
router.post("/register", signup); // Alias for signup
router.post("/login", login);
router.post("/google-login", googleLogin);

// Health check
router.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth routes are working',
    timestamp: new Date().toISOString()
  });
});

// =======================================
// PROTECTED ROUTES
// =======================================
router.get("/verify", protect, verifyToken);
router.get("/me", protect, getCurrentUser); // Get current user
router.put("/profile", protect, updateProfile); // Update profile
router.post("/logout", protect, logout);

export default router;
