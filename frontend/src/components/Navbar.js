import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setNoResults(false);
    setShowResults(false);

    try {
      // Search instruments
      const instrumentsRes = await fetch('/api/instruments');
      const instruments = await instrumentsRes.json();

      // Search instrument parts
      const partsRes = await fetch('/api/instrument-parts');
      const parts = await partsRes.json();

      // Filter results based on search query
      const query = searchQuery.toLowerCase();
      const foundInstruments = instruments.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.details.toLowerCase().includes(query)
      ).map(item => ({ ...item, type: 'instrument' }));

      const foundParts = parts.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.details.toLowerCase().includes(query)
      ).map(item => ({ ...item, type: 'part' }));

      const allResults = [...foundInstruments, ...foundParts];

      if (allResults.length === 0) {
        setNoResults(true);
      } else {
        setSearchResults(allResults);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setNoResults(true);
    } finally {
      setSearching(false);
    }
  };

  const handleResultClick = (item) => {
    setShowResults(false);
    setSearchQuery('');
    setSearchResults([]);
    if (item.type === 'instrument') {
      navigate('/instruments', { state: { itemId: item._id } });
    } else {
      navigate('/instrument-parts', { state: { itemId: item._id } });
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setNoResults(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h1 className="navbar-brand">Musicstore.lk</h1>
            <div className="navbar-links">
              <Link to="/instruments" className="nav-link">Instruments</Link>
              <Link to="/instrument-parts" className="nav-link">Instrument Parts</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </div>
          </div>

          <div className="navbar-center">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Search instruments and parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn" disabled={searching}>
                {searching ? '...' : '🔍'}
              </button>
            </form>
          </div>

          <div className="navbar-right">
            <span className="user-name">Hello, {user?.name}</span>
            <div 
              className="user-photo-icon" 
              onClick={() => navigate('/profile')}
              title="Go to Profile"
            >
              {user?.photo ? (
                <img src={user.photo} alt={user.name} />
              ) : (
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* Search Results - Rendered outside nav using Portal */}
      {showResults && ReactDOM.createPortal(
        <div className="search-overlay" onClick={handleCloseResults}>
          <div className="search-results-container" onClick={(e) => e.stopPropagation()}>
            <div className="search-results-header">
              <h3>Search Results ({searchResults.length})</h3>
              <button className="close-results-btn" onClick={handleCloseResults}>✕</button>
            </div>
            <div className="search-results-list">
              {searchResults.map((item) => (
                <div key={`${item.type}-${item._id}`} className="search-result-item" onClick={() => handleResultClick(item)}>
                  {item.image && (
                    <div className="search-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                  )}
                  <div className="search-item-info">
                    <h4>{item.name}</h4>
                    <p className="search-item-type">{item.type === 'instrument' ? 'Instrument' : 'Instrument Part'}</p>
                    <p className="search-item-details">{item.details}</p>
                    <p className="search-item-price">Rs. {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* No Results Message - Rendered outside nav using Portal */}
      {noResults && ReactDOM.createPortal(
        <div className="search-overlay" onClick={handleCloseResults}>
          <div className="search-results-container no-results" onClick={(e) => e.stopPropagation()}>
            <div className="search-results-header">
              <h3>Search Results</h3>
              <button className="close-results-btn" onClick={handleCloseResults}>✕</button>
            </div>
            <div className="no-results-message">
              <p>Out of Stock</p>
              <p className="no-results-subtext">No items found for "{searchQuery}"</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Navbar;
