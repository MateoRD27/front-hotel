import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';



// Rutas perezosas
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Reportes = lazy(() => import('./components/Reportes'));


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
          isAuthenticated ? <Navigate to="/reportes" /> : <Navigate to="/login" />
        } />

        {/* Rutas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/reportes" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/reportes" />} />

        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route path="/reportes" element={<Reportes />} />
            {/* Agrega más rutas protegidas aquí */}
          </Route>
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </Suspense>
  );
}

export default App;
