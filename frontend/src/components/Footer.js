import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ABOUT MUSICSTORE.LK</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#responsibility">Environmental & Social Responsibility</a></li>
            <li><a href="#philanthropy">Philanthropy</a></li>
            <li><a href="#why">Why Choose Musicstore.lk?</a></li>
            <li><a href="#tour">Tour Our Store</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>CUSTOMER SERVICE</h3>
          <ul>
            <li><a href="#shipping">Free Shipping Policy</a></li>
            <li><a href="#order-status">Order Status</a></li>
            <li><a href="#return">Return Policy</a></li>
            <li><a href="#tax">Sales and Use Tax Policy</a></li>
            <li><a href="#support">Product Support Articles</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>ORDERING</h3>
          <ul>
            <li><a href="#catalog">Free Catalog</a></li>
            <li><a href="#gift-cards">Gift Cards</a></li>
            <li><a href="#payment">Payment Options</a></li>
            <li><a href="#delivery">Shipping and Delivery Times</a></li>
            <li><a href="#exchange">Gear Exchange</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>SERVICES</h3>
          <ul>
            <li><a href="#workshop">Guitar Workshop</a></li>
            <li><a href="#repairs">Electronic Repairs Workshop</a></li>
            <li><a href="#store">Music Store</a></li>
            <li><a href="#events">Events & Workshops</a></li>
            <li><a href="#showroom">Piano Showroom</a></li>
            <li><a href="#lessons">Music Lessons</a></li>
            <li><a href="#recording">Recording Studio</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-info">
          <p><strong>Musicstore.lk</strong> - Your Premier Music Instrument Store</p>
          <p>If you have any questions, please contact us at (800) 222-4700</p>
        </div>
        <div className="footer-legal">
          <p>© 2026 Musicstore.lk - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
