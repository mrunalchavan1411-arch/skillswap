// services/api.js
// Yeh file backend ke saath saari communication handle karti hai
// Saare API calls yahi se hoti hain - taaki ek hi jagah manage ho

import axios from 'axios';

// IMPORTANT: Agar backend kisi alag PC/port pe chal raha ho, to yeh URL change karna
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Har request ke saath automatically token bhej dena (agar login hai)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agar token expire ho gaya (401 error), to user ko login page pe bhej do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('skillswap_token');
      localStorage.removeItem('skillswap_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const signupApi = (data) => api.post('/auth/signup', data);
export const loginApi = (data) => api.post('/auth/login', data);

// ========== USERS ==========
export const getMyProfile = () => api.get('/users/me');
export const updateMyProfile = (data) => api.put('/users/me', data);
export const getAllUsers = () => api.get('/users/all');
export const getMatches = () => api.get('/users/matches');

// ========== SESSIONS ==========
export const createSession = (data) => api.post('/sessions', data);
export const getMySessions = () => api.get('/sessions/my');
export const updateSessionStatus = (id, status) => api.put(`/sessions/${id}/status`, { status });
export const deleteSession = (id) => api.delete(`/sessions/${id}`);

// ========== MESSAGES ==========
export const getChatHistory = (partnerId) => api.get(`/messages/${partnerId}`);
export const getConversations = () => api.get('/messages/conversations/list');

// ========== UPLOAD ==========
export const uploadAvatar = (formData) => api.post('/upload/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const uploadChatFile = (formData) =>
  api.post('/upload/chat', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  

export default api;
