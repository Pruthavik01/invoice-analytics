// src/utils/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const api = {
  getStats: () => axios.get(`${API_BASE}/stats`),
  getTrends: () => axios.get(`${API_BASE}/stats/trends`),
  getTopVendors: () => axios.get(`${API_BASE}/stats/vendors/top10`),
  getCategories: () => axios.get(`${API_BASE}/stats/categories`),
  getInvoices: (params) => axios.get(`${API_BASE}/invoices`, { params }),
  chatWithData: (question) => axios.post(`${API_BASE}/chat`, { question })
};