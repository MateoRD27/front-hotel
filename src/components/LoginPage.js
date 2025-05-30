import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = () => {
    console.log('Usuario:', usuario, 'Contraseña:', contraseña);
    // Aquí puedes agregar la lógica de autenticación
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Header con logo y configuración */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            <span className="text-gray-800 font-medium">Grupo Montaña</span>
          </div>
          <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Bienvenidos
        </h1>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Botón Entrar */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;