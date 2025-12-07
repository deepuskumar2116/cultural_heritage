import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityAPI, placeAPI, amenityAPI, feedbackAPI } from '../services/api';
import '../styles/admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cities');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>🏛️ Admin Dashboard</h1>
          <div className="header-user">
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {/* Sidebar Navigation */}
        <nav className="admin-sidebar">
          <button 
            className={`nav-btn ${activeTab === 'cities' ? 'active' : ''}`}
            onClick={() => setActiveTab('cities')}
          >
            🏙️ Manage Cities
          </button>
          <button 
            className={`nav-btn ${activeTab === 'places' ? 'active' : ''}`}
            onClick={() => setActiveTab('places')}
          >
            📍 Manage Places
          </button>
          <button 
            className={`nav-btn ${activeTab === 'amenities' ? 'active' : ''}`}
            onClick={() => setActiveTab('amenities')}
          >
            🏨 Manage Amenities
          </button>
          <button 
            className={`nav-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            💬 View Feedback
          </button>
        </nav>

        {/* Main Content */}
        <main className="admin-main">
          {activeTab === 'cities' && <CitiesSection />}
          {activeTab === 'places' && <PlacesSection />}
          {activeTab === 'amenities' && <AmenitiesSection />}
          {activeTab === 'feedback' && <FeedbackSection />}
        </main>
      </div>
    </div>
  );
}

// Cities Management Component
function CitiesSection() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  React.useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await cityAPI.getAllCities();
      setCities(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load cities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await cityAPI.createCity(data);
      if (response.data.ok) {
        setFormData({ name: '', description: '', image: null });
        alert('City added successfully!');
        fetchCities();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create city');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Manage Cities</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>City Name</label>
          <input
            type="text"
            placeholder="e.g., Bangalore, Delhi, Mumbai"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe this city..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label>City Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Add City'}
        </button>
      </form>

      <div className="cities-list">
        <h3>Cities ({cities.length})</h3>
        {cities.length === 0 ? (
          <p className="empty-message">No cities added yet. Create one above!</p>
        ) : (
          <div className="grid">
            {cities.map(city => (
              <div key={city.id} className="city-card">
                <h4>{city.name}</h4>
                <p>{city.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Places Management Component
function PlacesSection() {
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    city_id: '',
    name: '',
    description: '',
    address: '',
    image: null,
  });

  React.useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await cityAPI.getAllCities();
      setCities(response.data);
    } catch (err) {
      setError('Failed to load cities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.city_id || !formData.name) {
      setError('City and Name are required');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('city_id', formData.city_id);
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('address', formData.address);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await placeAPI.createPlace(data);
      if (response.data.ok) {
        setFormData({
          city_id: '',
          name: '',
          description: '',
          address: '',
          image: null,
        });
        alert('Place added successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create place');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Manage Places</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>City *</label>
          <select
            value={formData.city_id}
            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            required
          >
            <option value="">Select a city...</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Place Name *</label>
          <input
            type="text"
            placeholder="e.g., Vidhana Soudha, Bangalore Palace"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe this heritage site or place..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Full address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Place Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Place'}
        </button>
      </form>
    </div>
  );
}

// Amenities Management Component
function AmenitiesSection() {
  const [cities, setCities] = useState([]);
  const [amenityTypes, setAmenityTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    city_id: '',
    amenity_type_id: '',
    name: '',
    description: '',
    address: '',
    phone: '',
    website_url: '',
    google_maps_url: '',
    price_range: '',
    rating: 3.5,
    image: null,
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const citiesRes = await cityAPI.getAllCities();
      const typesRes = await amenityAPI.getAllAmenityTypes();
      setCities(citiesRes.data);
      setAmenityTypes(typesRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.city_id || !formData.amenity_type_id || !formData.name) {
      setError('City, Type, and Name are required');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('city_id', formData.city_id);
      data.append('amenity_type_id', formData.amenity_type_id);
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('website_url', formData.website_url);
      data.append('google_maps_url', formData.google_maps_url);
      data.append('price_range', formData.price_range);
      data.append('rating', formData.rating);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await amenityAPI.createAmenity(data);
      if (response.data.ok) {
        setFormData({
          city_id: '',
          amenity_type_id: '',
          name: '',
          description: '',
          address: '',
          phone: '',
          website_url: '',
          google_maps_url: '',
          price_range: '',
          rating: 3.5,
          image: null,
        });
        alert('Amenity added successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create amenity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Manage Amenities</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <select
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
              required
            >
              <option value="">Select a city...</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.amenity_type_id}
              onChange={(e) => setFormData({ ...formData, amenity_type_id: e.target.value })}
              required
            >
              <option value="">Select type...</option>
              {amenityTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            placeholder="e.g., The Leela Palace, Bangalore"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe this amenity..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              placeholder="Full address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Contact number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Google Maps URL</label>
            <input
              type="url"
              placeholder="https://maps.google.com/..."
              value={formData.google_maps_url}
              onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price Range</label>
            <input
              type="text"
              placeholder="e.g., Budget, Mid-range, Premium"
              value={formData.price_range}
              onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Amenity'}
        </button>
      </form>
    </div>
  );
}

// Feedback View Component
function FeedbackSection() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedback(response.data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>User Feedback</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <p className="empty-message">No feedback yet</p>
      ) : (
        <div className="feedback-list">
          {feedback.map(item => (
            <div key={item.id} className="feedback-item">
              <strong>{item.tourist_name || 'Anonymous'}</strong>
              <p>{item.comment}</p>
              <small>{new Date(item.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
