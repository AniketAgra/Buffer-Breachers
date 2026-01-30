import api from './api';

// Authentication endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Copilot endpoints
export const copilotAPI = {
  query: (data) => api.post('/copilot/query', data),
  getHistory: () => api.get('/copilot/history'),
  submitFeedback: (data) => api.post('/copilot/feedback', data),
};

// Travel endpoints
export const travelAPI = {
  searchFlights: (data) => api.post('/travel/flights/search', data),
  searchHotels: (data) => api.post('/travel/hotels/search', data),
  searchActivities: (data) => api.post('/travel/activities/search', data),
  getDestinations: () => api.get('/travel/destinations'),
  getDestination: (id) => api.get(`/travel/destinations/${id}`),
};

// Safety endpoints
export const safetyAPI = {
  getDestinationSafety: (name) => api.get(`/safety/destination/${name}`),
  getActiveAlerts: (destination) => api.get(`/safety/alerts/${destination}`),
  getAreaSafety: (destination) => api.get(`/safety/areas/${destination}`),
  getDemographicSafety: (destination, demographic) =>
    api.get(`/safety/demographic/${destination}/${demographic}`),
  reportSafety: (data) => api.post('/safety/report', data),
};

// Booking endpoints
export const bookingAPI = {
  createBooking: (data) => api.post('/booking/create', data),
  getUserBookings: () => api.get('/booking/user'),
  getBooking: (id) => api.get(`/booking/${id}`),
  cancelBooking: (id, data) => api.post(`/booking/${id}/cancel`, data),
  modifyBooking: (id, data) => api.put(`/booking/${id}/modify`, data),
};

// Review endpoints
export const reviewAPI = {
  createReview: (data) => api.post('/review', data),
  getReviews: (entityId, entityType) =>
    api.get(`/review/${entityId}`, { params: { entityType } }),
  getUserReviews: () => api.get('/review/user/me'),
  markHelpful: (id, helpful) => api.post(`/review/${id}/helpful`, { helpful }),
};
