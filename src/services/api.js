import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:8585/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear local storage and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Sesión expirada. Por favor ingrese nuevamente.');
          break;
        case 403:
          toast.error('No tiene permisos para realizar esta acción.');
          break;
        case 404:
          toast.error('El recurso solicitado no existe.');
          break;
        case 500:
          toast.error('Error del servidor. Intente nuevamente más tarde.');
          break;
        default:
          // Get error message from backend if available
          const errorMessage = response.data?.message || 'Ocurrió un error inesperado';
          toast.error(errorMessage);
      }
    } else {
      // Network error or other issues
      toast.error('Error de conexión. Verifique su conexión a internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;