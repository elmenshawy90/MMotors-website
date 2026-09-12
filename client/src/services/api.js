import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

const TOKEN_KEY = 'mm_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/auth/login')
    ) {
      const token = getAdminToken();
      const isLoginPage = window.location.pathname === '/admin/login';
      if (token && !isLoginPage) {
        setAdminToken(null);
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  }
);

// Cars
export const getCars = (params) => api.get('/cars', { params });
export const getFeaturedCars = () => api.get('/cars/featured');
export const getCar = (id) => api.get(`/cars/${id}`);

// Branches (public - active only)
export const getBranches = () => api.get('/branches');

// Content
export const getContent = () => api.get('/content');

// Booking
export const createBooking = (data) => api.post('/bookings', data);

// Buy New Car
export const createBuyRequest = (data) => api.post('/buy-requests', data);

// Car images (public)
export const getCarImages = (id) => api.get(`/cars/${id}/images`);

// Admin: buy requests
export const getAdminBuyRequests = () => api.get('/admin/buy-requests');
export const updateBuyRequestStatus = (id, status) => api.put(`/admin/buy-requests/${id}`, { status });
export const deleteBuyRequest = (id) => api.delete(`/admin/buy-requests/${id}`);

// Admin: car images (multi-image gallery)
export const getAdminCarImages = (id) => api.get(`/admin/cars/${id}/images`);
export const uploadAdminCarImages = (id, formData) =>
  api.post(`/admin/cars/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAdminCarImage = (carId, imageId) => api.delete(`/admin/cars/${carId}/images/${imageId}`);
export const setPrimaryAdminCarImage = (carId, imageId) => api.put(`/admin/cars/${carId}/images/${imageId}/primary`);
export const reorderAdminCarImages = (carId, order) => api.put(`/admin/cars/${carId}/images/reorder`, { order });

// Auth
export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const adminVerify = () => api.post('/auth/verify');

// Admin: stats
export const getAdminStats = () => api.get('/admin/stats');

// Admin: cars
export const createAdminCar = (formData) =>
  api.post('/admin/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAdminCar = (id, formData) =>
  api.put(`/admin/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAdminCar = (id) => api.delete(`/admin/cars/${id}`);

// Admin: bookings
export const getAdminBookings = () => api.get('/admin/bookings');
export const updateBookingStatus = (id, status) => api.put(`/admin/bookings/${id}`, { status });
export const deleteBooking = (id) => api.delete(`/admin/bookings/${id}`);

// Admin: branches
export const getAdminBranches = () => api.get('/admin/branches');
export const getAdminBranch = (id) => api.get(`/admin/branches/${id}`);
export const createAdminBranch = (formData) =>
  api.post('/admin/branches', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAdminBranch = (id, formData) =>
  api.put(`/admin/branches/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const toggleBranchActive = (id) => api.patch(`/admin/branches/${id}/active`);
export const deleteAdminBranch = (id) => api.delete(`/admin/branches/${id}`);

// Admin: content
export const updateContent = (key, lang, content) =>
  api.put(`/admin/content/${key}`, { lang, content });

export default api;