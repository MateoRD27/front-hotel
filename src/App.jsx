import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CalendarioReservas from './components/reserva/landingpage';
import ModificarReserva from './components/reserva/ModificarReserva';
import EliminarReserva from './components/reserva/EliminarReserva';
import CrearReserva from './components/reserva/CrearReserva';
import axios from 'axios';
import './App.css';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import ListarHuespedes from './components/huesped/ListarHuespedes';
import CrearHuesped from './components/huesped/CrearHuesped';
import ModificarHuesped from './components/huesped/ModificarHuesped';
import EliminarHuesped from './components/huesped/EliminarHuesped';



// Rutas perezosas
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Reportes = lazy(() => import('./components/reporte/Reportes'));
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
          isAuthenticated ? <Navigate to="/reservas" /> : <Navigate to="/login" />
        } />

        {/* Rutas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/reservas" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/reservas" />} />

        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/reservas" element={<CalendarioReservas />} />
            <Route path="/reservas/crear" element={<CrearReserva />} />
            <Route path="/reservas/modificar/:id" element={<ModificarReserva />} />
            <Route path="/reservas/eliminar/:id" element={<EliminarReserva />} />
            <Route path="/huespedes" element={<ListarHuespedes/>} />
            <Route path="/huespedes/crear" element={<CrearHuesped />} />
            <Route path="/huespedes/modificar/:id" element={<ModificarHuesped/>} />
            <Route path="/huespedes/eliminar/:id" element={<EliminarHuesped/>} />
          </Route>
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </Suspense>
  );
}


function ModificarReservaWrapper() {
  const { id } = require('react-router-dom').useParams();
  return <ModificarReserva reservaId={id} />;
}
 
function EliminarReservaWrapper() {
  const { id } = require('react-router-dom').useParams();
  return <EliminarReserva reservaId={id} />;
}

export default App;
