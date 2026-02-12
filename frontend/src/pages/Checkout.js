import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Pages.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  // Get cart items or single item from location state
  const { items, totalAmount, purchaseType } = location.state || {};

  useEffect(() => {
    if (!items || items.length === 0) {
      alert('No items to checkout');
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleConfirmPurchase = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Create purchase record with payment method
      const purchaseResponse = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: items,
          totalAmount: totalAmount,
          purchaseType: purchaseType || 'cart',
          paymentMethod: paymentMethod
        })
      });

      if (!purchaseResponse.ok) {
        alert('Failed to record purchase');
        setLoading(false);
        return;
      }

      // If it's a cart purchase, clear the cart
      if (purchaseType === 'cart') {
        // Delete all cart items
        for (const item of items) {
          if (item.cartItemId) {
            await fetch(`/api/cart/${item.cartItemId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }
        }
      }

      alert(`Purchase successful!\nPayment Method: ${paymentMethod === 'card' ? 'Card Payment' : 'Cash on Delivery'}\nTotal: Rs. ${totalAmount}`);
      navigate('/instruments');
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Error processing purchase');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="checkout-container">
          <h1>Checkout</h1>
          
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-info">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="order-item-image" />
                    )}
                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs. {item.price}</p>
                      <p><strong>Subtotal: Rs. {(item.price * item.quantity).toFixed(2)}</strong></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h3>Total Amount: Rs. {totalAmount}</h3>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Select Payment Method</h2>
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <h3>Card Payment</h3>
                  <p>Pay securely with your credit or debit card</p>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <h3>Cash on Delivery</h3>
                  <p>Pay with cash when your order arrives</p>
                </div>
              </label>
            </div>
          </div>

          <div className="checkout-actions">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              Back to Cart
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleConfirmPurchase}
              disabled={loading || !paymentMethod}
            >
              {loading ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
