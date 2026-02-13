import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/User.css';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Edit Profile Form State
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  });
  const [profileErrors, setProfileErrors] = useState({});

  // =======================================
  // FETCH DATA ON MOUNT
  // =======================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          console.log('❌ No auth data found, redirecting to home');
          navigate('/');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Fetch current user data from API
        await fetchCurrentUser(token);
        
        // Fetch joined communities
        await fetchJoinedCommunities(token);

      } catch (err) {
        console.error('❌ Error fetching data:', err);
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
      console.log('🔍 Fetching current user...');
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ User data fetched:', data.user.email);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update profile form data
        setProfileFormData({
          name: data.user.name || '',
          username: data.user.username || '',
          bio: data.user.bio || '',
          avatar: data.user.avatar || data.user.picture || ''
        });
      } else {
        throw new Error(data.message || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('❌ Error fetching current user:', err);
      if (err.message.includes('token') || err.message.includes('auth')) {
        handleLogout();
      }
    }
  };

  // =======================================
  // FETCH JOINED COMMUNITIES
  // =======================================
  const fetchJoinedCommunities = async (token) => {
    try {
      console.log('🔍 Fetching joined communities...');
      const response = await fetch(`${API_URL}/api/communities/joined`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Communities fetched:', data.count);
        setJoinedCommunities(data.communities || []);
      } else {
        console.warn('⚠️ Could not fetch communities:', data.message);
        setJoinedCommunities([]);
      }
    } catch (err) {
      console.error('❌ Error fetching communities:', err);
      setJoinedCommunities([]);
    }
  };

  // =======================================
  // VALIDATE USER PROFILE
  // =======================================
  const validateUserProfile = () => {
    if (!user) {
      alert('User data not found. Please log in again.');
      navigate('/');
      return false;
    }

    // Check if user has completed their profile
    if (!user.name || !user.email || !user.username) {
      alert('⚠️ Please complete your profile before entering the garden.\n\nRequired: Name, Email, and Username');
      setShowEditProfileModal(true);
      return false;
    }

    return true;
  };

  // =======================================
  // HANDLE EDIT PROFILE
  // =======================================
  const handleEditProfile = () => {
    setProfileFormData({
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || user?.picture || ''
    });
    setProfileErrors({});
    setShowEditProfileModal(true);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileFormData.name || profileFormData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!profileFormData.username || profileFormData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileFormData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (profileFormData.bio && profileFormData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }

    setIsSavingProfile(true);

    try {
      const token = localStorage.getItem('userToken');

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileFormData.name.trim(),
          username: profileFormData.username.trim().toLowerCase(),
          bio: profileFormData.bio.trim(),
          avatar: profileFormData.avatar.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Profile updated successfully');
        
        // Update user state and localStorage
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('✅ Profile updated successfully!');
        setShowEditProfileModal(false);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      alert(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // =======================================
  // HANDLE SOLO GARDEN NAVIGATION
  // =======================================
  const handleEnterSoloGarden = () => {
    if (!validateUserProfile()) return;
    
    console.log('✅ Entering Solo Garden');
    navigate('/solo-garden');
  };

  // =======================================
  // HANDLE COMMUNITY GARDEN MODAL
  // =======================================
  const handleShowCommunityModal = () => {
    if (!validateUserProfile()) return;
    
    setShowCommunityModal(true);
  };

  // =======================================
  // ENTER SPECIFIC COMMUNITY
  // =======================================
  const handleEnterCommunity = (communityId) => {
    console.log('✅ Entering Community:', communityId);
    navigate(`/community/${communityId}`);
  };

  // =======================================
  // JOIN COMMUNITY BY CODE
  // =======================================
  const handleJoinCommunity = async () => {
    if (!searchCode || searchCode.trim().length !== 4) {
      alert('⚠️ Please enter a valid 4-digit community code');
      return;
    }

    if (!/^\d{4}$/.test(searchCode)) {
      alert('⚠️ Community code must be 4 digits (numbers only)');
      return;
    }

    setIsJoining(true);

    try {
      const token = localStorage.getItem('userToken');
      console.log('🔍 Attempting to join community with code:', searchCode);

      const response = await fetch(`${API_URL}/api/communities/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: searchCode.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Successfully joined community:', data.community.name);
        alert(`🎉 Successfully joined ${data.community.name}!`);
        await fetchJoinedCommunities(token);
        setSearchCode('');
      } else {
        console.warn('⚠️ Failed to join:', data.message);
        alert(data.message || 'Failed to join community. Please check the code and try again.');
      }
    } catch (err) {
      console.error('❌ Error joining community:', err);
      alert('❌ Error joining community. Please check your connection and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // =======================================
  // CREATE COMMUNITY
  // =======================================
  const handleCreateCommunity = async (communityData) => {
    if (!communityData.name || communityData.name.trim().length < 3) {
      alert('⚠️ Community name must be at least 3 characters long');
      return;
    }

    setIsCreating(true);

    try {
      const token = localStorage.getItem('userToken');
      console.log('🔍 Creating community:', communityData.name);

      const response = await fetch(`${API_URL}/api/communities/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: communityData.name.trim(),
          description: communityData.description?.trim() || ''
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Community created:', data.community.code);
        alert(`🎉 Community created successfully!\n\nYour community code is: ${data.community.code}\n\nShare this code with others to invite them!`);
        await fetchJoinedCommunities(token);
        setShowCreateModal(false);
      } else {
        console.warn('⚠️ Failed to create:', data.message);
        alert(data.message || 'Failed to create community. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error creating community:', err);
      alert('❌ Error creating community. Please check your connection and try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // =======================================
  // SHARE COMMUNITY
  // =======================================
  const handleShareCommunity = (community) => {
    setSelectedCommunity(community);
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('✅ Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Copied to clipboard!');
      });
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
      console.error('❌ Logout error:', err);
    } finally {
      console.log('👋 Logging out...');
      localStorage.clear();
      navigate('/');
    }
  };

  // =======================================
  // LOADING STATE
  // =======================================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your garden...</p>
      </div>
    );
  }

  // =======================================
  // ERROR STATE
  // =======================================
  if (error && !user) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="user-page">
      {/* Header Bar */}
      <header className="top-header">
        <div className="header-left">
          <h1>Welcome, {user?.name || 'Gardener'}! 🌱</h1>
          <p>Ready to tend to your garden?</p>
        </div>
        <div className="header-right">
          <button className="btn-edit-profile" onClick={handleEditProfile}>
            <span>✏️</span> Edit Profile
          </button>
          <button className="btn-signout" onClick={handleLogout}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="garden-content">
        <div className="garden-section">
          <h2 className="section-title">Enter Your Garden</h2>
          
          <div className="garden-cards">
            {/* Personal Garden Card */}
            <div 
              className="garden-card personal-garden"
              onClick={handleEnterSoloGarden}
            >
              <div className="card-icon">🏡</div>
              <h3>Personal Garden</h3>
              <p>Your private space to grow and nurture your plants</p>
              <button className="card-btn">Enter Garden →</button>
            </div>

            {/* Community Garden Card */}
            <div 
              className="garden-card community-garden"
              onClick={handleShowCommunityModal}
            >
              <div className="card-icon">🌍</div>
              <h3>Community Garden</h3>
              <p>Connect with fellow gardeners and share your journey</p>
              <button className="card-btn">Explore Communities →</button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => !isSavingProfile && setShowEditProfileModal(false)}>
          <div className="modal-content edit-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Your Profile ✏️</h2>
              <button 
                className="modal-close"
                onClick={() => !isSavingProfile && setShowEditProfileModal(false)}
                disabled={isSavingProfile}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Avatar Preview */}
              <div className="avatar-section">
                <div className="avatar-preview">
                  {profileFormData.avatar ? (
                    <img src={profileFormData.avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {profileFormData.name ? profileFormData.name[0].toUpperCase() : '👤'}
                    </div>
                  )}
                </div>
                <div className="avatar-info">
                  <h3>Profile Picture</h3>
                  <p>Enter an image URL or leave blank for default</p>
                </div>
              </div>

              {/* Profile Form */}
              <form className="profile-form" onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}>
                {/* Avatar URL */}
                <div className="form-group">
                  <label>Avatar URL (Optional)</label>
                  <input
                    type="url"
                    name="avatar"
                    value={profileFormData.avatar}
                    onChange={handleProfileInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="form-input"
                    disabled={isSavingProfile}
                  />
                </div>

                {/* Name */}
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={profileFormData.name}
                    onChange={handleProfileInputChange}
                    placeholder="Enter your full name"
                    className={`form-input ${profileErrors.name ? 'error' : ''}`}
                    required
                    disabled={isSavingProfile}
                  />
                  {profileErrors.name && <span className="error-message">{profileErrors.name}</span>}
                </div>

                {/* Username */}
                <div className="form-group">
                  <label>Username <span className="required">*</span></label>
                  <input
                    type="text"
                    name="username"
                    value={profileFormData.username}
                    onChange={handleProfileInputChange}
                    placeholder="Enter a unique username"
                    className={`form-input ${profileErrors.username ? 'error' : ''}`}
                    required
                    disabled={isSavingProfile}
                  />
                  {profileErrors.username && <span className="error-message">{profileErrors.username}</span>}
                  <span className="field-hint">Letters, numbers, and underscores only</span>
                </div>

                {/* Email (Read-only) */}
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="form-input"
                    disabled
                  />
                  <span className="field-hint">Email cannot be changed</span>
                </div>

                {/* Bio */}
                <div className="form-group">
                  <label>Bio (Optional)</label>
                  <textarea
                    name="bio"
                    value={profileFormData.bio}
                    onChange={handleProfileInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    maxLength={500}
                    className={`form-textarea ${profileErrors.bio ? 'error' : ''}`}
                    disabled={isSavingProfile}
                  />
                  {profileErrors.bio && <span className="error-message">{profileErrors.bio}</span>}
                  <span className="field-hint">{profileFormData.bio.length}/500 characters</span>
                </div>

                {/* Required Notice */}
                <div className="required-notice">
                  <span className="required">*</span> Required fields must be filled to access all features
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowEditProfileModal(false)}
                    disabled={isSavingProfile}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Community Modal */}
      {showCommunityModal && (
        <div className="modal-overlay" onClick={() => setShowCommunityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Community Gardens 🌍</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCommunityModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Search by Code */}
              <div className="search-section">
                <h3>Join a Community</h3>
                <p className="section-description">Enter a 4-digit code to join an existing community</p>
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="0000"
                    value={searchCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setSearchCode(value);
                    }}
                    maxLength={4}
                    className="code-input"
                    disabled={isJoining}
                  />
                  <button 
                    className="btn-join"
                    onClick={handleJoinCommunity}
                    disabled={isJoining || searchCode.length !== 4}
                  >
                    {isJoining ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </div>

              {/* Create Community Button */}
              <div className="create-section">
                <button 
                  className="btn-create-community"
                  onClick={() => {
                    setShowCommunityModal(false);
                    setShowCreateModal(true);
                  }}
                  disabled={isJoining}
                >
                  <span>➕</span> Create New Community
                </button>
              </div>

              {/* Joined Communities */}
              <div className="joined-communities">
                <h3>Your Communities ({joinedCommunities.length})</h3>
                {joinedCommunities.length > 0 ? (
                  <div className="communities-list">
                    {joinedCommunities.map((community) => (
                      <div key={community.id || community._id} className="community-item">
                        <div className="community-info">
                          <h4>{community.name}</h4>
                          <p className="community-code">Code: {community.code}</p>
                          <p className="community-members">
                            👥 {community.members} member{community.members !== 1 ? 's' : ''}
                          </p>
                          {community.isAdmin && (
                            <span className="admin-badge">Admin</span>
                          )}
                        </div>
                        <div className="community-actions">
                          <button 
                            className="btn-enter"
                            onClick={() => handleEnterCommunity(community.id || community._id)}
                          >
                            Enter
                          </button>
                          <button 
                            className="btn-share"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareCommunity(community);
                            }}
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-communities">
                    <p>🌱 You haven't joined any communities yet.</p>
                    <p>Create one or join using a code above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => !isCreating && setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Community Garden 🌱</h2>
              <button 
                className="modal-close"
                onClick={() => !isCreating && setShowCreateModal(false)}
                disabled={isCreating}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form 
                className="create-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleCreateCommunity({
                    name: formData.get('name'),
                    description: formData.get('description')
                  });
                }}
              >
                <div className="form-group">
                  <label>Community Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter community name (min. 3 characters)"
                    required
                    minLength={3}
                    maxLength={100}
                    className="form-input"
                    disabled={isCreating}
                  />
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    name="description"
                    placeholder="Describe your community..."
                    rows="4"
                    maxLength={500}
                    className="form-textarea"
                    disabled={isCreating}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Community'}
                  </button>
                  <button 
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedCommunity && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Share Community 📤</h2>
              <button 
                className="modal-close"
                onClick={() => setShowShareModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <h3>{selectedCommunity.name}</h3>
              <p className="share-description">
                Share this code or link with others to invite them to your community
              </p>
              
              <div className="share-section">
                <label>Community Code</label>
                <div className="share-item">
                  <input
                    type="text"
                    value={selectedCommunity.code}
                    readOnly
                    className="share-input"
                  />
                  <button 
                    className="btn-copy"
                    onClick={() => copyToClipboard(selectedCommunity.code)}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="share-section">
                <label>Community Link</label>
                <div className="share-item">
                  <input
                    type="text"
                    value={`${window.location.origin}/join/${selectedCommunity.code}`}
                    readOnly
                    className="share-input"
                  />
                  <button 
                    className="btn-copy"
                    onClick={() => copyToClipboard(`${window.location.origin}/join/${selectedCommunity.code}`)}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
