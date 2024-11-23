import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://98.71.171.3:8001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle admin login attempt separately
    if (
      error.config.url === '/admin/token' && 
      error.response?.status === 401 &&
      error.response?.data?.detail === "Incorrect username or password"
    ) {
      return Promise.reject(error);
    }

    // Handle other 401 unauthorized cases with redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Skip error toast for 404 on the users endpoint
    if (
      error.response?.status === 404 && 
      error.config.url.includes('/admin/') && 
      error.config.url.includes('/users') &&
      error.response?.data?.detail === "No users found for the given admin ID."
    ) {
      return Promise.reject(error);
    }

    // Skip default error toast for user creation errors
    if (error.config.url === '/users/' && error.config.method === 'post') {
      return Promise.reject(error);
    }

    // Show toast for all other errors
    const message = error.response?.data?.message || 'Une erreur est survenue';
    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;