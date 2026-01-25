import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">January 2026</span>
              </div>
            </div>
          </div>
          <div className="profile-section">
            <h3>Account Settings</h3>
            <button className="profile-btn">Edit Profile</button>
            <button className="profile-btn">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
