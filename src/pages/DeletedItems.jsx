import React, { useState, useEffect } from 'react';
import { getDeletedClothingItems, restoreClothingItem } from '../api';
import Loader from '../components/Loader';
import './home.css';

const DeletedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const fetchDeletedItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeletedClothingItems();
      if (response.success) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching deleted items:", err);
      setError("Failed to load deleted items.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this item to your wardrobe?")) return;

    try {
      await restoreClothingItem(id);
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error restoring item:", err);
      alert("Failed to restore item.");
    }
  };

  return (
    <div className="home-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Unavailable Items</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Items you've removed from your wardrobe.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading trash..." />
      ) : error ? (
        <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>
      ) : (
        <div className="clothing-grid">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id} className="clothing-card" style={{ opacity: 0.8 }}>
                <div className="card-image-container">
                  <img 
                    src={item.imageURL} 
                    alt={item.category} 
                    className="card-image"
                    style={{ filter: 'grayscale(100%)' }}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x600?text=No+Image'; }} 
                  />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{item.color} {item.category}</h3>
                  <div className="card-meta">
                    <span className="badge" style={{ backgroundColor: '#eee', color: '#666' }}>Deleted</span>
                  </div>
                  <button 
                    onClick={() => handleRestore(item._id)}
                    style={{
                      marginTop: '0.8rem',
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'var(--color-accent)', 
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                   Restore ♻️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>Unavailable Items is empty</h3>
              <p>No unavailable items found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeletedItems;
