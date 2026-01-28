import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item._id !== itemId));
        alert('Item removed from cart');
      } else {
        alert('Failed to remove item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error removing item');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setCartItems(cartItems.map(item => 
          item._id === itemId ? updatedItem : item
        ));
      } else {
        alert('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity');
    }
  };

  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/cart/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCartItems([]);
        alert(`${result.message}\nTotal: $${result.total}\nItems: ${result.itemCount}`);
      } else {
        alert('Purchase failed');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Error processing purchase');
    }
  };

  const handlePurchaseItem = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const itemTotal = (item.price * item.quantity).toFixed(2);
    
    try {
      const response = await fetch(`/api/cart/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems(cartItems.filter(cartItem => cartItem._id !== item._id));
        alert(`Purchase successful!\nItem: ${item.name}\nQuantity: ${item.quantity}\nTotal: $${itemTotal}`);
      } else {
        alert('Purchase failed');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Error processing purchase');
    }
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
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  
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
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handlePurchaseItem(item)}
                      className="purchase-item-btn"
                    >
                      Purchase
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
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
