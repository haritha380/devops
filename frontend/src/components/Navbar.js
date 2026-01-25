import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1 className="navbar-brand">Music Store</h1>
          <div className="navbar-links">
            <Link to="/instruments" className="nav-link">Instruments</Link>
            <Link to="/instrument-parts" className="nav-link">Instrument Parts</Link>
            <Link to="/cart" className="nav-link">Cart</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>
        </div>
        <div className="navbar-right">
          <span className="user-name">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
