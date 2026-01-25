import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import './AdminPages.css';

const AdminInstruments = () => {
  const [instruments, setInstruments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', details: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch instruments from database
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
        setError('Failed to fetch instruments');
      }
    } catch (error) {
      setError('Error fetching instruments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instrument) => {
    setEditingId(instrument._id);
    setFormData({
      name: instrument.name,
      price: instrument.price,
      details: instrument.details,
      image: instrument.image || ''
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/instruments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedInstrument = await response.json();
        setInstruments(instruments.map(item => 
          item._id === editingId ? updatedInstrument : item
        ));
        setEditingId(null);
        setFormData({ name: '', price: '', details: '', image: '' });
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error updating instrument: ' + error.message);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/instruments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      if (response.ok) {
        const newInstrument = await response.json();
        setInstruments([newInstrument, ...instruments]);
        setShowAddForm(false);
        setFormData({ name: '', price: '', details: '', image: '' });
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error adding instrument: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instrument?')) {
      try {
        const response = await fetch(`/api/instruments/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setInstruments(instruments.filter(item => item._id !== id));
        } else {
          const data = await response.json();
          alert('Error: ' + data.message);
        }
      } catch (error) {
        alert('Error deleting instrument: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container">
        <AdminNavbar />
        <div className="admin-page-content">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>Manage Instruments</h1>
          <button className="admin-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add New Instrument'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showAddForm && (
          <div className="admin-form-card">
            <h3>Add New Instrument</h3>
            <div className="admin-form">
              <input
                type="text"
                placeholder="Instrument Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <textarea
                placeholder="Details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <button className="admin-save-btn" onClick={handleAdd}>Add Instrument</button>
            </div>
          </div>
        )}

        <div className="admin-items-grid">
          {instruments.length === 0 ? (
            <p>No instruments found. Add one to get started!</p>
          ) : (
            instruments.map((instrument) => (
              <div key={instrument._id} className="admin-item-card">
                {editingId === instrument._id ? (
                  <div className="admin-edit-form">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <textarea
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <div className="admin-btn-group">
                      <button className="admin-save-btn" onClick={handleSave}>Save</button>
                      <button className="admin-cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{instrument.name}</h3>
                    <p className="admin-price">${instrument.price}</p>
                    <p className="admin-details">{instrument.details}</p>
                    <div className="admin-btn-group">
                      <button className="admin-edit-btn" onClick={() => handleEdit(instrument)}>Edit</button>
                      <button className="admin-delete-btn" onClick={() => handleDelete(instrument._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInstruments;
