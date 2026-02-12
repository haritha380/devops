import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import './AdminPages.css';

const AdminInstrumentParts = () => {
  const [parts, setParts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', details: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch parts from database
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
        setError('Failed to fetch parts');
      }
    } catch (error) {
      setError('Error fetching parts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (part) => {
    setEditingId(part._id);
    setFormData({
      name: part.name,
      price: part.price,
      details: part.details,
      image: part.image || ''
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/instrument-parts/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedPart = await response.json();
        setParts(parts.map(item => 
          item._id === editingId ? updatedPart : item
        ));
        setEditingId(null);
        setFormData({ name: '', price: '', details: '', image: '' });
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error updating part: ' + error.message);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/instrument-parts', {
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
        const newPart = await response.json();
        setParts([newPart, ...parts]);
        setShowAddForm(false);
        setFormData({ name: '', price: '', details: '', image: '' });
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error adding part: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        const response = await fetch(`/api/instrument-parts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setParts(parts.filter(item => item._id !== id));
        } else {
          const data = await response.json();
          alert('Error: ' + data.message);
        }
      } catch (error) {
        alert('Error deleting part: ' + error.message);
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
          <h1>Manage Instrument Parts</h1>
          <button className="admin-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add New Part'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showAddForm && (
          <div className="admin-form-card">
            <h3>Add New Part</h3>
            <div className="admin-form">
              <input
                type="text"
                placeholder="Part Name"
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
              <button className="admin-save-btn" onClick={handleAdd}>Add Part</button>
            </div>
          </div>
        )}

        <div className="admin-items-grid">
          {parts.length === 0 ? (
            <p>No parts found. Add one to get started!</p>
          ) : (
            parts.map((part) => (
              <div key={part._id} className="admin-item-card">
                {editingId === part._id ? (
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
                    {part.image && (
                      <div className="admin-item-image">
                        <img src={part.image} alt={part.name} />
                      </div>
                    )}
                    <h3>{part.name}</h3>
                    <p className="admin-price">Rs. {part.price}</p>
                    <p className="admin-details">{part.details}</p>
                    {part.image && (
                      <p className="admin-image-url">Image: {part.image.substring(0, 40)}...</p>
                    )}
                    <div className="admin-btn-group">
                      <button className="admin-edit-btn" onClick={() => handleEdit(part)}>Edit</button>
                      <button className="admin-delete-btn" onClick={() => handleDelete(part._id)}>Delete</button>
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

export default AdminInstrumentParts;
