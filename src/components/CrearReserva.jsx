import React, { useState } from 'react';
import { crearReserva } from './apiReservas';

const CrearReserva = () => {
  const [reserva, setReserva] = useState({
    fechaCheckin: '',
    fechaCheckout: '',
    numPersonas: 1,
    notas: '',
    estadoReserva: 'EN_CURSO',
    habitacionId: '',
    usuarioId: '',
    numeroHabitacion: '',
    // Campos de huésped
    huesped: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      documentoIdentidad: '',
      tipoDocumento: '',
      notas: '',
    },
  });

  const handleChange = (field, value) => {
    if (field.startsWith('huesped.')) {
      const subField = field.split('.')[1];
      setReserva(prev => ({
        ...prev,
        huesped: {
          ...prev.huesped,
          [subField]: value
        }
      }));
    } else {
      setReserva(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleGuardar = async () => {
    // Validación básica de campos requeridos
    if (!reserva.habitacionId || !reserva.usuarioId || !reserva.numeroHabitacion || !reserva.huesped.nombre || !reserva.huesped.apellido || !reserva.huesped.email) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      const now = new Date();
      const reservaData = {
        fechaReserva: now.toISOString(),
        fechaCheckin: reserva.fechaCheckin,
        fechaCheckout: reserva.fechaCheckout,
        numPersonas: Number(reserva.numPersonas),
        notas: reserva.notas,
        estadoReserva: reserva.estadoReserva,
        habitacionId: Number(reserva.habitacionId),
        usuarioId: Number(reserva.usuarioId),
        numeroHabitacion: reserva.numeroHabitacion,
        huesped: reserva.huesped,
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
    // Aquí puedes limpiar el formulario o redirigir
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Crear reserva</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Detalles de la reserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Check-in</label>
                <input
                  type="date"
                  value={reserva.fechaCheckin}
                  onChange={e => handleChange('fechaCheckin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Check-out</label>
                <input
                  type="date"
                  value={reserva.fechaCheckout}
                  onChange={e => handleChange('fechaCheckout', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de personas</label>
                <input
                  type="number"
                  min={1}
                  value={reserva.numPersonas}
                  onChange={e => handleChange('numPersonas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={reserva.notas}
                  onChange={e => handleChange('notas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado de la reserva</label>
                <select
                  value={reserva.estadoReserva}
                  onChange={e => handleChange('estadoReserva', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="EN_CURSO">En curso</option>
                  <option value="FINALIZADA">Finalizada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Habitación</label>
                <input
                  type="number"
                  value={reserva.habitacionId}
                  onChange={e => handleChange('habitacionId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Usuario</label>
                <input
                  type="number"
                  value={reserva.usuarioId}
                  onChange={e => handleChange('usuarioId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de habitación</label>
                <input
                  type="text"
                  value={reserva.numeroHabitacion}
                  onChange={e => handleChange('numeroHabitacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Datos del huésped</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={reserva.huesped.nombre}
                  onChange={e => handleChange('huesped.nombre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  value={reserva.huesped.apellido}
                  onChange={e => handleChange('huesped.apellido', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={reserva.huesped.email}
                  onChange={e => handleChange('huesped.email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={reserva.huesped.telefono}
                  onChange={e => handleChange('huesped.telefono', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  value={reserva.huesped.direccion}
                  onChange={e => handleChange('huesped.direccion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <input
                  type="text"
                  value={reserva.huesped.ciudad}
                  onChange={e => handleChange('huesped.ciudad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <input
                  type="text"
                  value={reserva.huesped.pais}
                  onChange={e => handleChange('huesped.pais', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de documento</label>
                <input
                  type="text"
                  value={reserva.huesped.tipoDocumento}
                  onChange={e => handleChange('huesped.tipoDocumento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documento de identidad</label>
                <input
                  type="text"
                  value={reserva.huesped.documentoIdentidad}
                  onChange={e => handleChange('huesped.documentoIdentidad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas del huésped</label>
                <textarea
                  value={reserva.huesped.notas}
                  onChange={e => handleChange('huesped.notas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancelar}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar reservación
            </button>
            <button
              onClick={handleGuardar}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
