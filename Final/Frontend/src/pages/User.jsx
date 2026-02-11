import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/User.css';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completed: 0,
    successRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =======================================
  // FETCH DATA ON MOUNT
  // =======================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          navigate('/');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Fetch current user data from API
        await fetchCurrentUser(token);

        // Fetch user statistics (if endpoint exists)
        await fetchUserStats(token);

        // Fetch recent activity (if endpoint exists)
        await fetchRecentActivity(token);

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
  // FETCH CURRENT USER FROM API
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
  // FETCH USER STATISTICS
  // =======================================
  const fetchUserStats = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/users/user-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUserStats({
          totalProjects: data.stats.totalProjects || 0,
          activeTasks: data.stats.activeTasks || 0,
          completed: data.stats.completed || 0,
          successRate: data.stats.successRate || 0
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      // Use default stats if API not available
      setUserStats({
        totalProjects: 12,
        activeTasks: 24,
        completed: 89,
        successRate: 94
      });
    }
  };

  // =======================================
  // FETCH RECENT ACTIVITY
  // =======================================
  const fetchRecentActivity = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/users/activity`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setRecentActivity(data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching activity:', err);
      // Use default activity if API not available
      setRecentActivity([
        {
          id: 1,
          icon: '📄',
          title: 'New project created',
          description: 'E-commerce Dashboard - Feb 10, 2026'
        },
        {
          id: 2,
          icon: '✅',
          title: 'Task completed',
          description: 'Landing page design - Feb 9, 2026'
        },
        {
          id: 3,
          icon: '💬',
          title: 'New comment',
          description: 'Team feedback received - Feb 8, 2026'
        }
      ]);
    }
  };

  // =======================================
  // LOGOUT HANDLER
  // =======================================
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      navigate('/');
    }
  };

  // =======================================
  // REFRESH DATA
  // =======================================
  const refreshData = async () => {
    setLoading(true);
    const token = localStorage.getItem('userToken');

    if (token) {
      await fetchCurrentUser(token);
      await fetchUserStats(token);
      await fetchRecentActivity(token);
    }

    setLoading(false);
  };

  // =======================================
  // LOADING STATE
  // =======================================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
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
    <div className="user-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo">🌱</span>
          <h2>SkyGrow</h2>
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-link active">
            <span>📊</span> Dashboard
          </a>
          <a href="#analytics" className="nav-link">
            <span>📈</span> Analytics
          </a>
          <a href="#projects" className="nav-link">
            <span>📁</span> Projects
          </a>
          <a href="#tasks" className="nav-link">
            <span>✅</span> Tasks
          </a>
          <a href="#settings" className="nav-link">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Welcome, {user?.name || 'User'}!</h1>
            <p>Here's your dashboard overview</p>
          </div>
          <div className="user-profile">
            <div className="avatar">
              {user?.picture || user?.avatar ? (
                <img src={user.picture || user.avatar} alt={user.name} />
              ) : (
                <span>{(user?.name || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <strong>{user?.name || 'User'}</strong>
              <span>{user?.email}</span>
              {user?.role && (
                <span className="user-role-badge">{user.role}</span>
              )}
            </div>
          </div>
        </header>

        {/* Refresh Button */}
        <div className="refresh-section">
          <button className="refresh-btn" onClick={refreshData}>
            <span>🔄</span> Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div>
              <h3>Total Projects</h3>
              <p className="stat-value">{userStats.totalProjects}</p>
              <span className="stat-change">
                {userStats.totalProjects > 10 ? '+3 this month' : 'Getting started'}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div>
              <h3>Active Tasks</h3>
              <p className="stat-value">{userStats.activeTasks}</p>
              <span className="stat-change">
                {Math.floor(userStats.activeTasks * 0.2)} pending
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>Completed</h3>
              <p className="stat-value">{userStats.completed}</p>
              <span className="stat-change">
                +{Math.floor(userStats.completed * 0.13)} this week
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div>
              <h3>Success Rate</h3>
              <p className="stat-value">{userStats.successRate}%</p>
              <span className="stat-change">
                {userStats.successRate >= 90 ? 'Excellent' : 'Good'}
              </span>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="btn-view-all" onClick={refreshData}>
              Refresh
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id || activity._id} className="activity-item">
                  <span className="activity-icon">{activity.icon || '📄'}</span>
                  <div>
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <button className="action-btn" onClick={() => alert('New project feature coming soon!')}>
              <span>➕</span> New Project
            </button>
            <button className="action-btn" onClick={() => alert('Reports feature coming soon!')}>
              <span>📊</span> View Reports
            </button>
            <button className="action-btn" onClick={() => alert('Team invite feature coming soon!')}>
              <span>👥</span> Invite Team
            </button>
            <button className="action-btn" onClick={() => alert('Analytics feature coming soon!')}>
              <span>📈</span> Analytics
            </button>
          </div>
        </section>

        {/* User Info Section */}
        <section className="user-info">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{user?.role || 'user'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value ${user?.isActive ? 'active-status' : 'inactive-status'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString() 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default User;