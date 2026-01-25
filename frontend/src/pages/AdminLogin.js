import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Admin credentials validation
    const ADMIN_EMAIL = 'bandaraindika@gmail.com';
    const ADMIN_PASSWORD = 'Haritha@2001';

    if (formData.email !== ADMIN_EMAIL || formData.password !== ADMIN_PASSWORD) {
      setError('Invalid admin credentials');
      setLoading(false);
      return;
    }

    // If credentials are correct, log in as admin
    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/admin-instruments');
    } else {
      setError('Admin login failed. Please ensure admin account exists.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form admin-login">
        <h2>Admin Login</h2>
        <p className="admin-subtitle">Administrator Access Only</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>
          <button type="submit" disabled={loading} className="admin-btn">
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>
        <p>
          <button className="link-button" onClick={() => navigate('/login')}>
            Back to User Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
