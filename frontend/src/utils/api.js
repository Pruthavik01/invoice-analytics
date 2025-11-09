import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Stats endpoints
  getStats: () => api.get('/stats'),
  getTrends: () => api.get('/stats/trends'),
  getTopVendors: () => api.get('/stats/vendors/top10'),
  getCategories: () => api.get('/stats/categories'),
  getCashflow: () => api.get('/stats/cashflow'),
  
  // Invoice endpoints
  getInvoices: (params) => api.get('/invoices', { params }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  
  // Chat endpoint
  chatWithData: (question) => api.post('/chat', { question }),
};

export default api;

