import express from "express";
import { signup, login, googleLogin, verifyToken, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/register", signup); // Alias for signup
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);

// Protected Routes
router.get("/verify", authMiddleware, verifyToken);
router.get("/me", authMiddleware, verifyToken); // Get current user

export default router;
