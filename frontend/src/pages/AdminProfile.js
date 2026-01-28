import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { useAuth } from '../context/AuthContext';
import './AdminPages.css';

const AdminProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalInstruments: 0,
    totalParts: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalCartItems: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'bandaraindika@gmail.com',
    phone: '+94 77 123 4567',
    address: 'Colombo, Sri Lanka'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/stats/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-page-content">
        <h1>Admin Profile</h1>
        <div className="admin-profile-card">
          <div className="admin-profile-header">
            <div className="admin-profile-avatar">
              <span>{profileData.name.charAt(0)}</span>
            </div>
            <div>
              <h2>{profileData.name}</h2>
              <p className="admin-role">Administrator</p>
            </div>
          </div>

          <div className="admin-profile-section">
            <h3>Personal Information</h3>
            {isEditing ? (
              <div className="admin-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>
                <div className="admin-btn-group">
                  <button className="admin-save-btn" onClick={handleSave}>Save Changes</button>
                  <button className="admin-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-info-grid">
                  <div className="admin-info-item">
                    <span className="admin-info-label">Name:</span>
                    <span className="admin-info-value">{profileData.name}</span>
                  </div>
                  <div className="admin-info-item">
                    <span className="admin-info-label">Email:</span>
                    <span className="admin-info-value">{profileData.email}</span>
                  </div>
                  <div className="admin-info-item">
                    <span className="admin-info-label">Phone:</span>
                    <span className="admin-info-value">{profileData.phone}</span>
                  </div>
                  <div className="admin-info-item">
                    <span className="admin-info-label">Address:</span>
                    <span className="admin-info-value">{profileData.address}</span>
                  </div>
                </div>
                <button className="admin-edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </>
            )}
          </div>

          <div className="admin-profile-section">
            <h3>Security Settings</h3>
            <button className="admin-secondary-btn">Change Password</button>
            <button className="admin-secondary-btn">Enable Two-Factor Authentication</button>
          </div>

          <div className="admin-profile-section">
            <h3>Account Statistics</h3>
            {loadingStats ? (
              <p>Loading statistics...</p>
            ) : (
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <h4>Total Instruments</h4>
                  <p className="admin-stat-value">{stats.totalInstruments}</p>
                </div>
                <div className="admin-stat-card">
                  <h4>Total Parts</h4>
                  <p className="admin-stat-value">{stats.totalParts}</p>
                </div>
                <div className="admin-stat-card">
                  <h4>Total Users</h4>
                  <p className="admin-stat-value">{stats.totalUsers}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
