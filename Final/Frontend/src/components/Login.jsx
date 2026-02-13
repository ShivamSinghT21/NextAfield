import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login({ closeModal, switchToSignup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        username: formData.username,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("userName", response.data.user.name || response.data.user.username);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("Login Success:", response.data);

        if (response.data.user.role === 'admin') {
          console.log("Redirecting to Admin Dashboard");
          if (closeModal) closeModal();
          navigate("/admin");
        } else {
          console.log("Redirecting to Dashboard");
          if (closeModal) closeModal();
          navigate("/dashboard");
        }
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login Failed:", err);
      setError(
        err.response?.data?.message || 
        "Invalid username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    setError("");

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

        console.log("Google Login Success:", res.data);

        if (res.data.user.role === 'admin') {
          console.log("Redirecting to Admin Dashboard");
          if (closeModal) closeModal();
          navigate("/admin");
        } else {
          console.log("Redirecting to Dashboard");
          if (closeModal) closeModal();
          navigate("/dashboard");
        }
      } else {
        setError(res.data.message || "Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Login Failed:", error);
      setError(
        error.response?.data?.message || 
        "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        {closeModal && (
          <button
            className="modal-close"
            aria-label="Close login modal"
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
          <p className="modal-subtitle">Welcome back! Continue your growth journey</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username or email"
              value={formData.username}
              onChange={handleInputChange}
              autoFocus
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-footer-links">
            <button type="button" className="forgot-password-link">
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.error("Google Login Error");
              setError("Google login failed. Please try again.");
            }}
            disabled={loading}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        {switchToSignup && (
          <p className="modal-footer-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={switchToSignup}
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;