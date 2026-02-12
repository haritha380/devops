import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { useAuth } from '../context/AuthContext';
import './AdminPages.css';

const AdminProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    address: 'Colombo, Sri Lanka',
    profilePhoto: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchStats();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone || '+94 77 123 4567',
          address: data.address || 'Colombo, Sri Lanka',
          profilePhoto: data.profilePhoto || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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

  const handleSave = async () => {
    // Validate password if changing
    if (profileData.newPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        alert('New passwords do not match!');
        return;
      }
      if (profileData.newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
      }
      if (!profileData.currentPassword) {
        alert('Please enter your current password to change it!');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        profilePhoto: profileData.profilePhoto
      };

      // Add password fields if changing password
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      // Update admin profile in database
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update profile data display
        setProfileData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '+94 77 123 4567',
          address: data.user.address || 'Colombo, Sri Lanka',
          profilePhoto: data.user.profilePhoto || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setIsEditing(false);
        alert(data.message || 'Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) { // 5MB limit
      alert('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('photo', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData({ ...profileData, profilePhoto: data.url });
      } else {
        alert(data.message || 'Failed to upload image');
      }
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-page-content">
        <h1>Admin Profile</h1>
        <div className="admin-profile-card">
          <div className="admin-profile-header">
            <div className="admin-profile-avatar">
              {profileData.profilePhoto ? (
                <img src={profileData.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span>{profileData.name.charAt(0)}</span>
              )}
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
                  <label>Profile Photo URL (or upload below)</label>
                  <input
                    type="text"
                    value={profileData.profilePhoto}
                    onChange={(e) => setProfileData({ ...profileData, profilePhoto: e.target.value })}
                    placeholder="Enter photo URL"
                  />
                </div>
                <div className="form-group">
                  <label>Or Upload Photo from Desktop</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={uploading}
                    style={{ marginBottom: '10px' }}
                  />
                  {uploading && <p style={{ color: '#666', fontSize: '0.9rem' }}>Uploading...</p>}
                  {profileData.profilePhoto && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={profileData.profilePhoto} 
                        alt="Preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #ddd' }} 
                      />
                    </div>
                  )}
                </div>
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
                
                <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Change Password (Optional)</h4>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
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
