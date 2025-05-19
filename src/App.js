import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Cargando...');
  const [backendPort, setBackendPort] = useState(8585);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Función para obtener el puerto del backend desde Electron
    const getBackendPort = async () => {
      try {
        // Verificar si estamos en Electron
        if (window.electronAPI) {
          const port = await window.electronAPI.getBackendPort();
          setBackendPort(port);
          return port;
        }
        return 8585; // Puerto por defecto
      } catch (error) {
        console.error('Error al obtener el puerto del backend:', error);
        return 8080; // Puerto por defecto en caso de error
      }
    };

    // Función para probar la conexión con el backend
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

    // Inicializar la aplicación
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
      </header>
    </div>
  );
}

export default App;