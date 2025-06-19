import axios from 'axios'
import { SERVER_URL } from '../config';

const API_URL = SERVER_URL + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
}

// Products API
export const productsAPI = {
  getAll: () => api.get('/product'),
  getById: (id) => api.get(`/product/${id}`),
  create: (data) => {
    // If data is FormData, don't set Content-Type header
    if (data instanceof FormData) {
      return api.post('/product', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.post('/product', data)
  },
  update: (id, data) => {
    // If data is FormData, don't set Content-Type header
    if (data instanceof FormData) {
      return api.put(`/product/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return api.put(`/product/${id}`, data)
  },
  delete: (id) => api.delete(`/product/${id}`),
}

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/order/all'),
  getById: (id) => api.get(`/order/${id}`),
  updateStatus: (id, status) => api.put(`/order/${id}`, { status }),
}

// Promo Codes API
export const promoCodesAPI = {
  getAll: () => api.get('/promo/all'),
  create: (data) => api.post('/promo', data),
  update: (id, data) => api.put(`/promo/${id}`, data),
  delete: (id) => api.delete(`/promo/${id}`),
}

export default api 