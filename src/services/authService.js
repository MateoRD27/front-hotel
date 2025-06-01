import api from './api';

const authService = {
  login: async (credentials) => {
    return await api.post('/auth/signin', credentials);
  },
  
  register: async (userData) => {
    return await api.post('/auth/signup', userData);
  }
};

export default authService;