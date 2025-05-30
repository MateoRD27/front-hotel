import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { eliminarReserva, getReservaById } from './apiReservas';

const EliminarReserva = ({ reservaId = 1 }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservaInfo, setReservaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const data = await getReservaById(reservaId);
        setReservaInfo(data);
      } catch (error) {
        setReservaInfo(null);
        alert('Error al obtener la reserva');
      } finally {
        setLoading(false);
      }
    };
    fetchReserva();
  }, [reservaId]);

  const handleEliminar = () => {
    setShowConfirmation(true);
  };

  const handleConfirmarEliminacion = async () => {
    try {
      await eliminarReserva(reservaId);
      alert('Reserva eliminada exitosamente');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      alert('Error al eliminar la reserva');
      setShowConfirmation(false);
    }
  };

  const handleCancelarEliminacion = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando reserva...</div>;
  }
  if (!reservaInfo) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">No se encontró la reserva.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar (Si se repite en otros componentes, considera extraerlo) */}
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
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Eliminar Reserva</h1>
        <div className="bg-white shadow rounded-lg p-6">
          {/* Información de la reserva a eliminar */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Detalles de la reserva</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm mb-2">
                ⚠️ ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Llegada
                </label>
                <p className="text-gray-900">{reservaInfo.llegada}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Salida
                </label>
                <p className="text-gray-900">{reservaInfo.salida}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Habitación
                </label>
                <p className="text-gray-900">{reservaInfo.habitacion}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Huésped
                </label>
                <p className="text-gray-900">{reservaInfo.nombre} {reservaInfo.apellidos}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Teléfono
                </label>
                <p className="text-gray-900">{reservaInfo.telefono}</p>
              </div>
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => console.log('Cancelar eliminación')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleEliminar}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Eliminar Reserva
            </button>
          </div>
        </div>
      </div>
      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás completamente seguro de que deseas eliminar esta reserva?
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelarEliminacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminacion}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliminarReserva;