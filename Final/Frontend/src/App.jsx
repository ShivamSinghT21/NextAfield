import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import Admin from "./pages/Admin.jsx";
import Solo from "./components/Solo.jsx";
import Community from "./components/Community.jsx";

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// =======================================
// PROFILE CHECK UTILITY
// =======================================
const checkUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success && data.user) {
      const user = data.user;
      const hasProfile = user.name && user.email && user.username;
      
      return {
        hasProfile,
        user: data.user
      };
    }

    return {
      hasProfile: false,
      user: null
    };
  } catch (error) {
    console.error('Error checking user profile:', error);
    return {
      hasProfile: false,
      user: null
    };
  }
};

// =======================================
// PROTECTED ROUTE - Requires authentication
// =======================================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    console.log('❌ No token found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Token found, allowing access');
  return children;
};

// =======================================
// ADMIN ROUTE - Requires admin role
// =======================================
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    console.log('❌ No token found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  const userStr = localStorage.getItem('user');
  let userRole = null;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userRole = user.role;
      console.log('🔍 AdminRoute Check:', { 
        email: user.email, 
        role: userRole 
      });
    } catch (e) {
      console.error('❌ Error parsing user:', e);
      return <Navigate to="/" replace />;
    }
  }

  if (userRole !== 'admin') {
    console.log('❌ Not admin, redirecting to user page');
    return <Navigate to="/user" replace />;
  }

  console.log('✅ Admin verified, showing admin page');
  return children;
};

// =======================================
// USER ROUTE - Authenticated users only
// =======================================
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    console.log('❌ No token found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ User authenticated, showing user page');
  return children;
};

// =======================================
// GARDEN ROUTE - Requires complete profile
// =======================================
const GardenRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const validateProfile = async () => {
      if (!token) {
        console.log('❌ No token found, redirecting to home');
        setIsChecking(false);
        return;
      }

      try {
        const { hasProfile: profileExists, user } = await checkUserProfile(token);

        if (!profileExists) {
          console.log('❌ User profile not found or incomplete');
          setError('Profile not found or incomplete. Please complete your profile first.');
          setHasProfile(false);
        } else {
          console.log('✅ User profile verified:', user.email);
          localStorage.setItem('user', JSON.stringify(user));
          setHasProfile(true);
        }
      } catch (err) {
        console.error('❌ Error validating profile:', err);
        setError('Error validating user profile.');
        setHasProfile(false);
      } finally {
        setIsChecking(false);
      }
    };

    validateProfile();
  }, [token]);

  if (isChecking) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verifying your profile...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!hasProfile) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Profile Not Found</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button 
            onClick={() => window.location.href = '/user'}
            className="btn-primary"
          >
            Complete Profile
          </button>
          <button 
            onClick={() => window.location.href = '/user'}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// =======================================
// MAIN APP COMPONENT
// =======================================
export default function App() {
  return (
    <Routes>
      {/* ============== PUBLIC ROUTE ============== */}
      <Route path="/" element={<Home />} />

      {/* ============== USER ROUTES ============== */}
      <Route 
        path="/user" 
        element={
          <UserRoute>
            <User />
          </UserRoute>
        } 
      />

      {/* ============== GARDEN ROUTES ============== */}
      {/* Solo Garden - Personal Garden */}
      <Route 
        path="/solo-garden" 
        element={
          <GardenRoute>
            <Solo />
          </GardenRoute>
        } 
      />

      {/* Community Garden - Specific Community */}
      <Route 
        path="/community/:communityId" 
        element={
          <GardenRoute>
            <Community />
          </GardenRoute>
        } 
      />

      {/* Join Community by Code */}
      <Route 
        path="/join/:code" 
        element={
          <UserRoute>
            <User />
          </UserRoute>
        } 
      />

      {/* ============== ADMIN ROUTE ============== */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } 
      />

      {/* ============== FALLBACK ROUTES ============== */}
      <Route path="/dashboard" element={<Navigate to="/user" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
