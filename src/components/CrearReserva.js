import React, { useState } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';

const CrearReserva = () => {
  const [reserva, setReserva] = useState({
    llegada: '',
    salida: '',
    habitacion: '',
    tarifa: '',
    nombre: '',
    apellidos: '',
    telefono: ''
  });

  const handleChange = (field, value) => {
    setReserva(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      const response = await axios.post('http://localhost:8585/api/reservas', reserva);
      console.log('Reserva creada:', response.data);
      alert('Reserva creada exitosamente');
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Error al crear la reserva');
    }
  };

  const handleCancelar = () => {
    console.log('Cancelando creación de reserva');
    // Aquí la lógica para cancelar
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar (Podrías moverlo a un componente Layout si se repite) */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span className="text-gray-800 font-medium">Grupo Montaña</span>
            </div>
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">Inicio</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Reservaciones</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Huesped</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Habitaciones</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Inventario</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Reportes</a>
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm">
                Nueva Reserva
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Crear reserva</h1>
        <div className="bg-white shadow rounded-lg p-6">
          {/* Detalles de la reserva */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Detalles de la reserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Llegada
                </label>
                <input
                  type="date"
                  value={reserva.llegada}
                  onChange={(e) => handleChange('llegada', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salida
                </label>
                <input
                  type="date"
                  value={reserva.salida}
                  onChange={(e) => handleChange('salida', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitación
                </label>
                <select
                  value={reserva.habitacion}
                  onChange={(e) => handleChange('habitacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar habitación</option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="201">201</option>
                  <option value="202">202</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifa
                </label>
                <input
                  type="number"
                  value={reserva.tarifa}
                  onChange={(e) => handleChange('tarifa', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          {/* Información del huésped */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Información del huésped</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={reserva.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={reserva.apellidos}
                  onChange={(e) => handleChange('apellidos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={reserva.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancelar}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar reservación
            </button>
            <button
              onClick={handleGuardar}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearReserva;