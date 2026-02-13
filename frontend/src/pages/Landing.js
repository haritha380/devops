import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <video autoPlay loop muted playsInline className="landing-video">
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="landing-overlay"></div>

      {/* Top Navigation Bar */}
      <div className="landing-top-bar">
        <div className="landing-logo">
          <h2>Musicstore.lk</h2>
        </div>
        <div className="landing-top-buttons">
          <button 
            className="landing-top-btn login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="landing-top-btn signup-btn"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-hero">
          <h1 className="landing-title">Haritha</h1>
          <p className="landing-subtitle">Your Premier Destination for Musical Instruments</p>
          <p className="landing-description">
            Discover the finest collection of instruments, parts, and accessories. 
            Whether you're a beginner or a professional, we have everything you need to make beautiful music.
          </p>

          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon">🎸</div>
              <h3>Wide Selection</h3>
              <p>Guitars, Keyboards, Drums & More</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick & Reliable Shipping</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Card & Cash on Delivery</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Quality Assured</h3>
              <p>Authentic & Premium Products</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
