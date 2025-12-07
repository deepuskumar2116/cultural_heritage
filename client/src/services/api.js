import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  adminLogin: (username, password) => 
    api.post('/auth/admin/login', { username, password }),
  
  touristRegister: (name, username, password, email, phone) => 
    api.post('/auth/tourist/register', { name, username, password, email, phone }),
  
  touristLogin: (username, password) => 
    api.post('/auth/tourist/login', { username, password }),
};

// City APIs
export const cityAPI = {
  getAllCities: () => api.get('/cities'),
  getCity: (id) => api.get(`/cities/${id}`),
  createCity: (formData) => 
    api.post('/admin/cities', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  getCityPlaces: (cityId) => api.get(`/cities/${cityId}/places`),
  getCityAmenities: (cityId, typeId) => 
    api.get(`/cities/${cityId}/amenities`, { params: { type_id: typeId } }),
};

// Place APIs
export const placeAPI = {
  createPlace: (formData) => 
    api.post('/admin/places', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
};

// Amenity APIs
export const amenityAPI = {
  getAllAmenityTypes: () => api.get('/amenity-types'),
  createAmenity: (formData) => 
    api.post('/admin/amenities', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  getAmenity: (id) => api.get(`/amenities/${id}`),
  getAmenityReviews: (amenityId) => api.get(`/amenities/${amenityId}/reviews`),
};

// Review APIs
export const reviewAPI = {
  addReview: (amenityId, rating, comment) => 
    api.post('/reviews', { amenity_id: amenityId, rating, comment }),
};

// Feedback APIs
export const feedbackAPI = {
  submit: (comment) => api.post('/feedback', { comment }),
  getAll: () => api.get('/admin/feedback'),
};

export default api;
