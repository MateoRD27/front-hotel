import { createContext, useState, useContext, useCallback } from 'react';
import jwtDecode from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const token = response.token;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Decode token to get user info
      const decodedToken = jwtDecode(token);
      
      setUser({
        id: decodedToken.id,
        nombreUsuario: decodedToken.sub,
        rol: decodedToken.rol,
        nombre: decodedToken.nombre,
        apellido: decodedToken.apellido
      });
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      
      // Check token expiration
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token expired
        logout();
        return;
      }
      
      // Token is valid
      setUser({
        id: decodedToken.id,
        nombreUsuario: decodedToken.sub,
        rol: decodedToken.rol,
        nombre: decodedToken.nombre,
        apellido: decodedToken.apellido
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      register, 
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);