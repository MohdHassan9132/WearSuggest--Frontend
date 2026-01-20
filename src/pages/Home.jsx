import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClothingItems } from '../api';
import './home.css';

const TABS = [
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'accessory', label: 'Accessory' }
];

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('top');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab]);

  const fetchItems = async (type) => {
    setLoading(true);
    setError(null);
    try {
      // The API expects parameters to filter by type
      const response = await getClothingItems({ type });
      if (response.success) {
        console.log(response.data)
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>My Wardrobe</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Manage your collection. Currently viewing <strong>{activeTab}s</strong>.
        </p>
      </div>

      <div className="tabs-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading your items...</div>
      ) : error ? (
        <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>
      ) : (
        <div className="clothing-grid">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id} className="clothing-card">
                <div className="card-image-container">
                  <img 
                    src={item.imageURL} 
                    alt={item.category} 
                    className="card-image"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x600?text=No+Image'; }} 
                  />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{item.color} {item.category}</h3>
                  <div className="card-meta">
                    <span className="badge">{item.occasion[0]}</span>
                    <span className="badge">{item.season[0]}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No items found</h3>
              <p style={{ marginBottom: '1rem' }}>You haven't added any {activeTab}s yet.</p>
              <Link to="/add-item" className="submit-btn" style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
                Add your first {activeTab}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
