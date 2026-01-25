import React from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const Cart = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1>Shopping Cart</h1>
        <div className="cart-container">
          <p className="empty-cart">Your cart is empty</p>
          <p className="empty-cart-subtitle">Browse our instruments and parts to add items to your cart</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
