import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityAPI, amenityAPI, reviewAPI } from '../services/api';
import '../styles/tourist.css';

export default function TouristHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [amenityTypes, setAmenityTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [amenityReviews, setAmenityReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchCities();
    fetchAmenityTypes();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await cityAPI.getAllCities();
      setCities(response.data);
    } catch (err) {
      console.error('Failed to load cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmenityTypes = async () => {
    try {
      const response = await amenityAPI.getAllAmenityTypes();
      setAmenityTypes(response.data);
    } catch (err) {
      console.error('Failed to load amenity types:', err);
    }
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setSelectedType(null);
    setAmenities([]);
    setSelectedAmenity(null);
  };

  const handleTypeSelect = async (type) => {
    if (!selectedCity) return;
    
    setSelectedType(type);
    setLoading(true);
    
    try {
      const response = await cityAPI.getCityAmenities(selectedCity.id, type.id);
      setAmenities(response.data);
    } catch (err) {
      console.error('Failed to load amenities:', err);
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenitySelect = async (amenity) => {
    setSelectedAmenity(amenity);
    setShowReviewForm(false);
    setReviewData({ rating: 5, comment: '' });
    fetchAmenityReviews(amenity.id);
  };

  const fetchAmenityReviews = async (amenityId) => {
    try {
      const response = await amenityAPI.getAmenityReviews(amenityId);
      setAmenityReviews(response.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setAmenityReviews([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmitReview = async () => {
    if (!selectedAmenity || !reviewData.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await reviewAPI.addReview(selectedAmenity.id, reviewData.rating, reviewData.comment);
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Thank you for your review!');
      // Refresh reviews
      fetchAmenityReviews(selectedAmenity.id);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tourist-container">
      {/* Header */}
      <header className="tourist-header">
        <div className="header-content">
          <h1>🏛️ Explore Cultural Heritage</h1>
          <div className="header-user">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="tourist-content">
        {/* City Selection */}
        <section className="cities-section">
          <h2>Select a City</h2>
          {loading && !selectedCity ? (
            <p>Loading cities...</p>
          ) : cities.length === 0 ? (
            <p className="no-data">No cities available yet</p>
          ) : (
            <div className="cities-grid">
              {cities.map(city => (
                <div 
                  key={city.id} 
                  className={`city-card ${selectedCity?.id === city.id ? 'selected' : ''}`}
                  onClick={() => handleCitySelect(city)}
                >
                  {city.image_url && <img src={`http://localhost:4000${city.image_url}`} alt={city.name} />}
                  <h3>{city.name}</h3>
                  <p>{city.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Amenity Type Selection */}
        {selectedCity && (
          <section className="types-section">
            <h2>What would you like to explore in {selectedCity.name}?</h2>
            <div className="types-grid">
              {amenityTypes.map(type => (
                <button 
                  key={type.id}
                  className={`type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                  onClick={() => handleTypeSelect(type)}
                >
                  {getTypeIcon(type.name)} {type.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Amenities Display */}
        {selectedType && (
          <section className="amenities-section">
            <h2>{selectedType.name} in {selectedCity.name}</h2>
            {loading ? (
              <p>Loading {selectedType.name.toLowerCase()}...</p>
            ) : amenities.length === 0 ? (
              <p className="no-data">No {selectedType.name.toLowerCase()} found</p>
            ) : (
              <div className="amenities-grid">
                {amenities.map(amenity => (
                  <div 
                    key={amenity.id}
                    className="amenity-card"
                    onClick={() => handleAmenitySelect(amenity)}
                  >
                    {amenity.image_url && (
                      <img src={`http://localhost:4000${amenity.image_url}`} alt={amenity.name} />
                    )}
                    <div className="amenity-info">
                      <h3>{amenity.name}</h3>
                      <p className="description">{amenity.description}</p>
                      {amenity.rating && (
                        <div className="rating">⭐ {amenity.rating}/5</div>
                      )}
                      {amenity.price_range && (
                        <div className="price-range">💰 {amenity.price_range}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Amenity Details Modal */}
      {selectedAmenity && (
        <div className="modal-overlay" onClick={() => setSelectedAmenity(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedAmenity(null)}>✕</button>
            
            {selectedAmenity.image_url && (
              <img src={`http://localhost:4000${selectedAmenity.image_url}`} alt={selectedAmenity.name} className="modal-image" />
            )}

            <div className="modal-body">
              <h2>{selectedAmenity.name}</h2>
              <p className="description">{selectedAmenity.description}</p>

              <div className="details-grid">
                {selectedAmenity.address && (
                  <div className="detail-item">
                    <span className="label">📍 Address:</span>
                    <span>{selectedAmenity.address}</span>
                  </div>
                )}
                {selectedAmenity.phone && (
                  <div className="detail-item">
                    <span className="label">📞 Phone:</span>
                    <span>{selectedAmenity.phone}</span>
                  </div>
                )}
                {selectedAmenity.price_range && (
                  <div className="detail-item">
                    <span className="label">💰 Price Range:</span>
                    <span>{selectedAmenity.price_range}</span>
                  </div>
                )}
                {selectedAmenity.rating && (
                  <div className="detail-item">
                    <span className="label">⭐ Rating:</span>
                    <span>{selectedAmenity.rating}/5</span>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                {selectedAmenity.website_url && (
                  <a href={selectedAmenity.website_url} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                    🌐 Visit Website
                  </a>
                )}
                {selectedAmenity.google_maps_url && (
                  <a href={selectedAmenity.google_maps_url} target="_blank" rel="noopener noreferrer" className="action-btn">
                    🗺️ View on Maps
                  </a>
                )}
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="action-btn">
                  ✍️ Add Review
                </button>
              </div>

              {showReviewForm && (
                <div className="review-form">
                  <h3>Share Your Experience</h3>
                  <div className="form-group">
                    <label>Rating (1-5 stars)</label>
                    <select 
                      value={reviewData.rating}
                      onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 ⭐</option>
                      <option value={2}>2 ⭐⭐</option>
                      <option value={3}>3 ⭐⭐⭐</option>
                      <option value={4}>4 ⭐⭐⭐⭐</option>
                      <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Your Review</label>
                    <textarea
                      placeholder="Tell us about your experience..."
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      rows="4"
                    ></textarea>
                  </div>
                  <button 
                    onClick={handleSubmitReview}
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {amenityReviews.length > 0 && (
                <div className="reviews-section">
                  <h3>💬 Recent Reviews ({amenityReviews.length})</h3>
                  <div className="reviews-list">
                    {amenityReviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <strong>{review.tourist_name || 'Anonymous'}</strong>
                          <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <small className="review-date">{new Date(review.created_at).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeIcon(typeName) {
  const icons = {
    'Bus Service': '🚌',
    'Flight': '✈️',
    'Train': '🚂',
    'Hotel': '🏨',
    'Restaurant': '🍽️',
    'Cafe/Bar': '☕',
    'Temple': '🛕',
    'Mall': '🏬',
    'Museum': '🏛️',
  };
  return icons[typeName] || '📍';
}
