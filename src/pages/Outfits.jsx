import React, { useState, useEffect } from 'react';
import { getRecentOutfits } from '../api';
import './outfits.css';

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    setLoading(true);
    try {
      const response = await getRecentOutfits();
      if (response.success) {
        // Take only the first 5 items if more exists
        setOutfits(response.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching outfits:", err);
      setError("Failed to load recent outfits.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper component to render an individual item
  const OutfitPiece = ({ item, label }) => {
    if (!item) return (
      <div className="outfit-item">
        <span className="item-label">{label}</span>
        <div className="missing-piece">None</div>
      </div>
    );

    return (
      <div className="outfit-item">
        <span className="item-label">{label}</span>
        <div className="item-visual">
          <img 
            src={item.imageURL} 
            alt={item.category} 
            onError={(e) => { e.target.src = 'https://placehold.co/150'; }}
          />
        </div>
        <div className="item-info">
          {item.color} {item.category}
        </div>
      </div>
    );
  };

  return (
    <div className="outfits-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Recent Outfits</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Your latest 5 style combinations.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your outfits...</div>
      ) : error ? (
        <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>
      ) : (
        <div className="outfits-grid">
          {outfits.length > 0 ? (
            outfits.map((outfit) => (
              <div key={outfit._id} className="outfit-card">
                <div className="outfit-header">
                  <div className="outfit-date">
                    Worn: {formatDate(outfit.lastWornAt || outfit.createdAt)}
                  </div>
                </div>

                <div className="outfit-composition">
                  {/* Top & Outerwear Row */}
                  <div className="composition-row">
                    <OutfitPiece item={outfit.top} label="Top" />
                    <OutfitPiece item={outfit.outerwear} label="Outerwear" />
                  </div>

                  {/* Bottom & Footwear Row */}
                  <div className="composition-row">
                    <OutfitPiece item={outfit.bottom} label="Bottom" />
                    <OutfitPiece item={outfit.footwear} label="Footwear" />
                  </div>

                  {/* Accessories */}
                  <div className="outfit-item composition-full">
                    <span className="item-label">Accessories</span>
                    {outfit.accessories && outfit.accessories.length > 0 ? (
                      <div className="accessories-list">
                        {outfit.accessories.map((acc) => (
                          <div key={acc._id} className="accessory-item" title={acc.category}>
                            <img src={acc.imageURL} alt={acc.category} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="missing-piece">None</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No recent outfits</h3>
              <p>Create some outfits to see them here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Outfits;
