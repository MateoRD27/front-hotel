import React, { useState } from 'react';
import { crearReserva } from './apiReservas';

const CrearReserva = () => {
  const [reserva, setReserva] = useState({
    fechaCheckin: '',
    fechaCheckout: '',
    numPersonas: 1,
    notas: '',
    estadoReserva: 'PENDIENTE',
    habitacionId: '',
    huespedId: '',
    usuarioId: '',
  });

  const handleChange = (field, value) => {
    setReserva(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      const now = new Date();
      const reservaData = {
        fechaReserva: now.toISOString(),
        fechaCheckin: reserva.fechaCheckin,
        fechaCheckout: reserva.fechaCheckout,
        numPersonas: Number(reserva.numPersonas),
        notas: reserva.notas,
        estadoReserva: reserva.estadoReserva,
        habitacion: { id: reserva.habitacionId },
        huesped: { id: reserva.huespedId },
        usuario: reserva.usuarioId ? { id: reserva.usuarioId } : undefined,
      };
      await crearReserva(reservaData);
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
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span className="text-gray-800 font-medium">Grupo Montaña</span>
            </div>
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
              {/* Puedes agregar un icono de usuario aquí si lo necesitas */}
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
                  Fecha Check-in
                </label>
                <input
                  type="date"
                  value={reserva.fechaCheckin}
                  onChange={e => handleChange('fechaCheckin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Check-out
                </label>
                <input
                  type="date"
                  value={reserva.fechaCheckout}
                  onChange={e => handleChange('fechaCheckout', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de personas
                </label>
                <input
                  type="number"
                  min={1}
                  value={reserva.numPersonas}
                  onChange={e => handleChange('numPersonas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={reserva.notas}
                  onChange={e => handleChange('notas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de la reserva
                </label>
                <select
                  value={reserva.estadoReserva}
                  onChange={e => handleChange('estadoReserva', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADA">Confirmada</option>
                  <option value="CANCELADA">Cancelada</option>
                  {/* Agrega más estados según tu Enum */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Habitación
                </label>
                <input
                  type="number"
                  value={reserva.habitacionId}
                  onChange={e => handleChange('habitacionId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Huésped
                </label>
                <input
                  type="number"
                  value={reserva.huespedId}
                  onChange={e => handleChange('huespedId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Usuario (opcional)
                </label>
                <input
                  type="number"
                  value={reserva.usuarioId}
                  onChange={e => handleChange('usuarioId', e.target.value)}
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