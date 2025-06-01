import React, { useState, useEffect } from 'react';
import CrearReserva from './components/CrearReserva'; // Importa el componente de crear reserva
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Cargando...');
  const [backendPort, setBackendPort] = useState(8585);
  const [status, setStatus] = useState('loading');

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
    };

    initApp();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hotel Management System</h1>
        <div className={`message-box ${status}`}>
          <h2>Estado del Backend:</h2>
          <p>{message}</p>
          <p>Puerto del backend: {backendPort}</p>
        </div>
        <p>
          Esta es una aplicación de ejemplo que demuestra la integración de Electron, React y Spring Boot.
        </p>
        {/* Aquí se muestra el formulario para agregar una reserva */}
        <CrearReserva />
      </header>
    </div>
  );
}

export default App;