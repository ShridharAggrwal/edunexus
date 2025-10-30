import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('edunexus_token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('edunexus_token');
  }
}

export function initAuthFromStorage() {
  const token = localStorage.getItem('edunexus_token');
  if (token) setAuthToken(token);
}


