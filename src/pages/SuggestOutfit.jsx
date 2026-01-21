import React, { useState } from 'react';
import { suggestOutfit, suggestToneBasedOutfit } from '../api';
import './suggestOutfit.css';
import './outfits.css'; // Reusing outfit card styles

const SuggestOutfit = () => {
  const [formData, setFormData] = useState({
    occasion: 'casual',
    weather: 'summer'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // API likely expects 'season' to match the item attributes, 
      // but we use 'weather' in UI as requested.
      // We pass both or map it. Assuming backend looks for 'season' or 'weather'.
      // Sending as standard keys usually used in item creation: season, occasion.
      const payload = {
        occasion: formData.occasion,
        season: formData.weather, // Mapping UI 'weather' to backend 'season' context
        tone: formData.tone
      };

      let response;
      if (formData.tone) {
        response = await suggestToneBasedOutfit(payload);
      } else {
        response = await suggestOutfit(payload);
      }

      if (response.success) {
        setResult(response.data);
      }
    } catch (err) {
      console.error("Suggestion error:", err);
      // specific handling if 404 means no outfit found
      if (err.response && (err.response.status === 404 || err.response.status === 400)) {
        setError("No matching outfit found for these conditions. Try adding more items to your wardrobe!");
      } else {
        setError("Failed to get a suggestion. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper component reused from Outfits.jsx logic (could be extracted to shared component)
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
    <div className="suggestion-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Get Suggestions</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Let's pick the perfect outfit for your day.
        </p>
      </div>

      <div className="suggestion-card">
        <form className="suggestion-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Occasion</label>
            <select 
              name="occasion" 
              value={formData.occasion}
              onChange={handleChange}
              className="suggestion-select"
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Weather</label>
            <select 
              name="weather" 
              value={formData.weather}
              onChange={handleChange}
              className="suggestion-select"
            >
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="rainy">Rainy</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Tone (Optional)</label>
            <select 
              name="tone" 
              value={formData.tone || ''}
              onChange={handleChange}
              className="suggestion-select"
            >
              <option value="">No Preference</option>
              <option value="neutral">Neutral</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
            </select>
          </div>

          <button type="submit" className="suggestion-btn" disabled={loading}>
            {loading ? 'Thinking...' : 'Suggest Outfit'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="suggestion-result">
          <h2 className="result-title">We Recommend:</h2>
          
          <div className="outfit-card" style={{ margin: 0, transform: 'none' }}>
            <div className="outfit-composition">
              {/* Top & Outerwear */}
              <div className="composition-row">
                <OutfitPiece item={result.top} label="Top" />
                <OutfitPiece item={result.outerwear} label="Outerwear" />
              </div>

              {/* Bottom & Footwear */}
              <div className="composition-row">
                <OutfitPiece item={result.bottom} label="Bottom" />
                <OutfitPiece item={result.footwear} label="Footwear" />
              </div>

              {/* Accessories */}
              <div className="outfit-item composition-full">
                <span className="item-label">Accessories</span>
                {result.accessories && result.accessories.length > 0 ? (
                  <div className="accessories-list">
                    {result.accessories.map((acc) => (
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
        </div>
      )}
    </div>
  );
};

export default SuggestOutfit;
