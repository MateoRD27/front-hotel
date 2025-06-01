import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/common/LoadingScreen';

// Rutas perezosas
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const [message, setMessage] = useState('Cargando...');
  const [backendPort, setBackendPort] = useState(8585);
  const [status, setStatus] = useState('loading');
  const { isAuthenticated, user, checkAuth } = useAuth();

  useEffect(() => {
    const getBackendPort = async () => {
      try {
        if (window.electronAPI) {
          const port = await window.electronAPI.getBackendPort();
          setBackendPort(port);
          return port;
        }
        return 8585;
      } catch (error) {
        console.error('Error al obtener el puerto del backend:', error);
        return 8080;
      }
    };

    const testBackendConnection = async (port) => {
      try {
        const response = await axios.get(`http://localhost:${port}/api/test`);
        setMessage(response.data.message);
        setStatus('success');
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
        setMessage('Error al conectar con el backend');
        setStatus('error');
      }
    };

    const initApp = async () => {
      const port = await getBackendPort();
      await testBackendConnection(port);
      checkAuth();
    };

    initApp();
  }, [checkAuth]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Redirigir raíz según autenticación */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />

        {/* Rutas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </Suspense>
  );
}

export default App;
