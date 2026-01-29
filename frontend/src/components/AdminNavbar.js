import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-left">
          <h1 className="admin-navbar-brand">Musicstore.lk - Admin</h1>
          <div className="admin-navbar-links">
            <Link to="/admin-instruments" className="admin-nav-link">Instruments</Link>
            <Link to="/admin-instrument-parts" className="admin-nav-link">Instrument Parts</Link>
            <Link to="/admin-profile" className="admin-nav-link">Profile</Link>
          </div>
        </div>
        <div className="admin-navbar-right">
          <span className="admin-user-name">Admin: {user?.name}</span>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
