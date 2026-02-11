import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import Admin from "./pages/Admin.jsx";

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

  // Check if user is logged in
  if (!token) {
    console.log('❌ No token found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Get user role from localStorage
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

  // Check if user is admin
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
// MAIN APP COMPONENT
// =======================================
export default function App() {
  return (
    <Routes>
      {/* ============== PUBLIC ROUTE ============== */}

      {/* Home/Landing Page */}
      <Route path="/" element={<Home />} />

      {/* ============== USER ROUTE ============== */}

      {/* User Dashboard - All authenticated users */}
      <Route 
        path="/user" 
        element={
          <UserRoute>
            <User />
          </UserRoute>
        } 
      />

      {/* ============== ADMIN ROUTE ============== */}

      {/* Admin Dashboard - Admin role only */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } 
      />

      {/* ============== FALLBACK ROUTES ============== */}

      {/* Redirect /dashboard to /user for backward compatibility */}
      <Route path="/dashboard" element={<Navigate to="/user" replace />} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}