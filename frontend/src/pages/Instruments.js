import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const Instruments = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch('/api/instruments');
      if (response.ok) {
        const data = await response.json();
        setInstruments(data);
      } else {
        setError('Failed to load instruments');
      }
    } catch (error) {
      setError('Error loading instruments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (instrument) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    console.log('Adding to cart - instrument:', instrument);
    console.log('Image URL:', instrument.image);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemType: 'instrument',
          itemId: instrument._id,
          name: instrument.name,
          price: instrument.price,
          details: instrument.details,
          image: instrument.image
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Cart item created:', result);
        alert('Item added to cart!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart');
    }
  };

  const handlePurchase = async (instrument) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to purchase items');
      return;
    }

    const confirmPurchase = window.confirm(
      `Purchase ${instrument.name} for $${instrument.price.toFixed(2)}?`
    );

    if (confirmPurchase) {
      try {
        // Record purchase in database
        const response = await fetch('/api/purchases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            items: [{
              itemType: 'instrument',
              itemId: instrument._id,
              name: instrument.name,
              price: instrument.price,
              quantity: 1,
              details: instrument.details,
              image: instrument.image
            }],
            totalAmount: instrument.price,
            purchaseType: 'direct'
          })
        });

        if (response.ok) {
          alert(`Successfully purchased ${instrument.name}! Thank you for your order.`);
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to process purchase');
        }
      } catch (error) {
        console.error('Error processing purchase:', error);
        alert('Error processing purchase. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="page-content">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1>Instruments</h1>
        <p>Browse our collection of musical instruments</p>
        {error && <p className="error-message">{error}</p>}
        <div className="items-grid">
          {instruments.length === 0 ? (
            <p>No instruments available at the moment.</p>
          ) : (
            instruments.map((instrument) => (
              <div key={instrument._id} className="item-card">
                {instrument.image && (
                  <div className="item-image">
                    <img src={instrument.image} alt={instrument.name} />
                  </div>
                )}
                <h3>{instrument.name}</h3>
                <p>{instrument.details}</p>
                <p className="price">${instrument.price.toFixed(2)}</p>
                <div className="item-buttons">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(instrument)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="purchase-btn"
                    onClick={() => handlePurchase(instrument)}
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Instruments;
