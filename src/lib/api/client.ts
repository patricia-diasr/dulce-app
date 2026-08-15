import axios from 'axios';
import { clearToken, getToken } from '@/shared/utils/tokenStorage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      window.location.assign(isAdminRoute ? '/admin/login' : '/login');
    }
    return Promise.reject(error);
  },
);
