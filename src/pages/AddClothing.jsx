import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClothingItem, analyzeImage } from '../api/clothingApi';
import './add-clothing.css';

const COLOR_GROUP_MAP = {
  black: "neutral",
  white: "neutral",
  grey: "neutral",
  blue: "cool",
  green: "cool",
  red: "warm",
  yellow: "warm",
  orange: "warm"
};

const AddClothing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false); // State for AI analysis
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    type: 'top',
    category: '',
    color: '', 
    itemImage: null,
    seasons: [],
    occasions: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, itemImage: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleAutoTag = async () => {
    if (!formData.itemImage) {
      setError("Please upload an image first to use Auto-Tag.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("itemImage", formData.itemImage);

      const result = await analyzeImage(data);
      if (result.success && result.data) {
        const aiData = result.data;
        
        // Auto-fill form with AI data
        setFormData(prev => ({
          ...prev,
          type: aiData.type || prev.type,
          category: aiData.category || prev.category,
          color: aiData.color || prev.color,
          // Handle array fields (AI might return arrays or single strings)
          seasons: Array.isArray(aiData.season) ? aiData.season : (aiData.season ? [aiData.season] : prev.seasons),
          occasions: Array.isArray(aiData.occasion) ? aiData.occasion : (aiData.occasion ? [aiData.occasion] : prev.occasions),
        }));
      }
    } catch (err) {
      console.error("Auto-tag error:", err);
      setError("Failed to analyze image. Please fill details manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemImage) {
      setError("Please upload an image of the item.");
      return;
    }
    if (!formData.color) { 
       setError("Please select a color.");
       return;
    }
    if (formData.seasons.length === 0) {
      setError("Please select at least one season.");
      return;
    }
    if (formData.occasions.length === 0) {
      setError("Please select at least one occasion.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('category', formData.category);
      data.append('color', formData.color);
      
      data.append('itemImage', formData.itemImage);
      
      formData.seasons.forEach(s => data.append('season', s));
      formData.occasions.forEach(o => data.append('occasion', o));

      const response = await addClothingItem(data);
      if (response.success) {
        navigate('/');
      }
    } catch (err) {
      console.error("Upload failed", err);
      setError(err.response?.data?.message || "Failed to add clothing item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-clothing-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Add New Item</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Upload a photo and details of your clothing piece.</p>
      </div>

      <div className="add-clothing-card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Photo</label>
            <div className="image-upload-area" onClick={() => document.getElementById('file-input').click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <span style={{ fontSize: '2rem' }}>📸</span>
                  <span>Click to upload image</span>
                </div>
              )}
              <input 
                id="file-input"
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Auto-Tag Button Area */}
            {previewUrl && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <button 
                  type="button" 
                  className="auto-tag-btn"
                  onClick={handleAutoTag}
                  disabled={analyzing}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: analyzing ? '#ccc' : 'var(--color-accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {analyzing ? (
                    <>
                      <span className="spinner-small"></span> Analyzing...
                    </>
                  ) : (
                    <>✨ Auto-Fill with AI</>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="footwear">Footwear</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category (e.g. Jeans, Shirt)</label>
              <input 
                type="text" 
                name="category"
                value={formData.category} 
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. T-Shirt"
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <select 
                name="color"
                value={formData.color} 
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a color</option>
                {Object.keys(COLOR_GROUP_MAP).map(colorKey => (
                  <option key={colorKey} value={colorKey}>
                    {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                  </option>
                ))}
              </select>
              {formData.color && (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Related to <strong>{COLOR_GROUP_MAP[formData.color]}</strong> shade
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Seasons</label>
            <div className="checkbox-group">
              {['rainy', 'summer','winter'].map(season => (
                <div 
                  key={season} 
                  className={`checkbox-label ${formData.seasons.includes(season) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('seasons', season)}
                >
                  <span style={{ textTransform: 'capitalize' }}>{season}</span>
                </div>
              ))}
            </div>
          </div>

            <div className="form-group">
            <label>Occasions</label>
            <div className="checkbox-group">
              {['casual', 'formal', 'party'].map(occasion => (
                <div 
                  key={occasion} 
                  className={`checkbox-label ${formData.occasions.includes(occasion) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('occasions', occasion)}
                >
                  <span style={{ textTransform: 'capitalize' }}>{occasion}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding Item...' : 'Add to Wardrobe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClothing;
