import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  };

  const handleDelete = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handlePurchase = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const total = calculateTotal();
    const itemCount = cartItems.length;
    
    // Clear cart
    localStorage.setItem('cart', '[]');
    setCartItems([]);
    
    alert(`Purchase successful!\nTotal: $${total}\nItems: ${itemCount}`);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="page-content">
          <h1>Loading cart...</h1>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem('token')) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="page-content">
          <h1>Shopping Cart</h1>
          <div className="cart-container">
            <p className="empty-cart">Please login to view your cart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1>Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="cart-container">
            <p className="empty-cart">Your cart is empty</p>
            <p className="empty-cart-subtitle">Browse our instruments and parts to add items to your cart</p>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-details">{item.details}</p>
                    <p className="cart-item-price">
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <span className="item-type-badge">
                      {item.itemType === 'instrument' ? 'Instrument' : 'Part'}
                    </span>
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <h2>Total:</h2>
                <h2 className="total-amount">${calculateTotal()}</h2>
              </div>
              <button 
                onClick={handlePurchase}
                className="purchase-btn"
              >
                Purchase Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
