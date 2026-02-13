import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Signup = ({ closeModal, switchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  // Validate form data
  const validateForm = () => {
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Direct Signup Handler
  const handleSignupForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");

        setTimeout(() => {
          if (switchToLogin) {
            switchToLogin();
          } else if (closeModal) {
            closeModal();
            navigate("/login");
          }
        }, 1500);
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup Failed:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Signup Handler
  const handleGoogleSignup = async (response) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!response?.credential) {
        throw new Error("No Credential Received");
      }

      const res = await axios.post("http://localhost:3000/api/auth/google-login", {
        credential: response.credential,
      });

      if (res.data.success) {
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("userAvatar", res.data.user.picture || "");
        localStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("Google Signup Success:", res.data);

        if (closeModal) closeModal();

        if (res.data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.data.message || "Google signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Signup Failed:", error);
      setError(
        error.response?.data?.message || 
        "Google signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content signup-modal" onClick={(e) => e.stopPropagation()}>
        {closeModal && (
          <button
            className="modal-close"
            aria-label="Close signup modal"
            onClick={closeModal}
            type="button"
          >
            ×
          </button>
        )}

        <div className="modal-header">
          <div className="modal-logo">
            <span className="logo-icon">🌱</span>
            <h2>SkyGrow</h2>
          </div>
          <p className="modal-subtitle">Start your growth journey today</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" role="alert">
            <span className="success-icon">✓</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSignupForm} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleInputChange}
              autoFocus
              required
              disabled={loading}
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => {
              console.error("Google Signup Error");
              setError("Google signup failed. Please try again.");
            }}
            disabled={loading}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
          />
        </div>

        {switchToLogin && (
          <p className="modal-footer-text">
            Already have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={switchToLogin}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        )}

        <p className="terms-text">
          By signing up, you agree to our{" "}
          <a href="/terms" target="_blank">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" target="_blank">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;