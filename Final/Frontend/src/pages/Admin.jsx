import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    verifiedUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =======================================
  // FETCH DATA ON MOUNT
  // =======================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('userToken');

        if (!userData || !token) {
          navigate('/');
          return;
        }

        const parsedUser = JSON.parse(userData);

        // Check if user is admin
        if (parsedUser.role !== 'admin') {
          navigate('/user');
          return;
        }

        setUser(parsedUser);

        // Fetch current user details from API
        await fetchCurrentUser(token);

        // Fetch all users
        await fetchAllUsers(token);

        // Fetch statistics
        await fetchStats(token);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // =======================================
  // FETCH CURRENT USER
  // =======================================
  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        // Update localStorage with latest user data
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      if (err.message.includes('token') || err.message.includes('auth')) {
        handleLogout();
      }
    }
  };

  // =======================================
  // FETCH ALL USERS
  // =======================================
  const fetchAllUsers = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/users/all?page=1&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users || data.data || []);
      } else {
        console.log('No users data available');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      // Use dummy data if API not available
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Sarah Smith',
          email: 'sarah@example.com',
          role: 'user',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  // =======================================
  // FETCH STATISTICS
  // =======================================
  const fetchStats = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/users/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats({
          totalUsers: data.stats?.totalUsers || 0,
          activeUsers: data.stats?.activeUsers || 0,
          totalAdmins: data.stats?.totalAdmins || 0,
          verifiedUsers: data.stats?.verifiedUsers || 0
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Keep default stats if API not available
    }
  };

  // =======================================
  // LOGOUT HANDLER
  // =======================================
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // =======================================
  // SWITCH TO USER VIEW
  // =======================================
  const switchToUserView = () => {
    navigate('/user');
  };

  // =======================================
  // DELETE USER
  // =======================================
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('User deleted successfully');
        // Refresh users list
        await fetchAllUsers(token);
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  // =======================================
  // EDIT USER
  // =======================================
  const handleEditUser = (userId) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', userId);
    alert('Edit functionality coming soon!');
  };

  // =======================================
  // LOADING STATE
  // =======================================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  // =======================================
  // ERROR STATE
  // =======================================
  if (error && !user) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <span className="logo">🌱</span>
          <h2>SkyGrow</h2>
          <span className="admin-badge">ADMIN</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-link active">
            <span>📊</span> Dashboard
          </a>
          <a href="#users" className="nav-link">
            <span>👥</span> Users
          </a>
          <a href="#analytics" className="nav-link">
            <span>📈</span> Analytics
          </a>
          <a href="#content" className="nav-link">
            <span>📝</span> Content
          </a>
          <a href="#settings" className="nav-link">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="switch-btn" onClick={switchToUserView}>
            <span>🔄</span> Switch to User View
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage and monitor your platform</p>
          </div>
          <div className="user-profile">
            <div className="avatar admin-avatar">
              {user?.picture || user?.avatar ? (
                <img src={user.picture || user.avatar} alt={user.name} />
              ) : (
                <span>{(user?.name || 'A')[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <span className="role-badge">Administrator</span>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div>
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
              <span className="stat-change">
                Registered users
              </span>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div>
              <h3>Active Users</h3>
              <p className="stat-value">{stats.activeUsers.toLocaleString()}</p>
              <span className="stat-change">
                Currently active
              </span>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">👑</div>
            <div>
              <h3>Admins</h3>
              <p className="stat-value">{stats.totalAdmins}</p>
              <span className="stat-change">Platform managers</span>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">📊</div>
            <div>
              <h3>Verified</h3>
              <p className="stat-value">{stats.verifiedUsers.toLocaleString()}</p>
              <span className="stat-change">Email verified</span>
            </div>
          </div>
        </section>

        {/* User Management Table */}
        <section className="table-section">
          <div className="section-header">
            <h2>Recent Users</h2>
            <button className="btn-view-all">View All ({users.length})</button>
          </div>
          <div className="table-container">
            {users.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id || u.id}>
                      <td>
                        <div className="user-cell">
                          <div className="mini-avatar">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <span>{u.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge badge-${u.role || 'user'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${u.isActive ? 'active' : 'inactive'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="icon-btn"
                          onClick={() => handleEditUser(u._id || u.id)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => handleDeleteUser(u._id || u.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <p>No users found</p>
              </div>
            )}
          </div>
        </section>

        {/* Admin Actions */}
        <section className="actions">
          <h2>Admin Actions</h2>
          <div className="action-grid">
            <button className="action-btn" onClick={() => alert('Add user functionality coming soon!')}>
              <span>➕</span> Add User
            </button>
            <button className="action-btn" onClick={() => alert('Broadcast functionality coming soon!')}>
              <span>📧</span> Send Broadcast
            </button>
            <button className="action-btn" onClick={() => alert('Export functionality coming soon!')}>
              <span>📊</span> Export Data
            </button>
            <button className="action-btn" onClick={() => navigate('/settings')}>
              <span>⚙️</span> System Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;