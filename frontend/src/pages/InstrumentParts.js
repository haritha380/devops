import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const InstrumentParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await fetch('/api/instrument-parts');
      if (response.ok) {
        const data = await response.json();
        setParts(data);
      } else {
        setError('Failed to load parts');
      }
    } catch (error) {
      setError('Error loading parts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (part) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemType: 'part',
          itemId: part._id,
          name: part.name,
          price: part.price,
          details: part.details,
          image: part.image
        })
      });

      if (response.ok) {
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
        <h1>Instrument Parts</h1>
        <p>Find replacement parts and accessories for your instruments</p>
        {error && <p className="error-message">{error}</p>}
        <div className="items-grid">
          {parts.length === 0 ? (
            <p>No parts available at the moment.</p>
          ) : (
            parts.map((part) => (
              <div key={part._id} className="item-card">
                {part.image && (
                  <div className="item-image">
                    <img src={part.image} alt={part.name} />
                  </div>
                )}
                <h3>{part.name}</h3>
                <p>{part.details}</p>
                <p className="price">${part.price.toFixed(2)}</p>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(part)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentParts;
