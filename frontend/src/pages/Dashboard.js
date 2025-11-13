import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <p>You are successfully logged in.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
