import React, { useState, useEffect } from 'react';
import { modificarReserva, getReservaById } from '../../services/apiReservas';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModificarReserva = ({ reservaId }) => {
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [habitaciones, setHabitaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const data = await getReservaById(reservaId);
        setReserva({
          ...data,
          habitacionId: data.habitacion?.id || '',
          huespedId: data.huesped?.id || '',
          usuarioId: data.usuario?.id || '',
        });
      } catch (error) {
        alert('Error al obtener la reserva');
      } finally {
        setLoading(false);
      }
    };
    fetchReserva();
  }, [reservaId]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await axios.get('http://localhost:8585/api/habitaciones');
        let habitacionesBackend = response.data;
        // Si la reserva ya tiene una habitación seleccionada y no está en la lista, la agregamos temporalmente
        if (reserva && reserva.habitacionId && !habitacionesBackend.some(h => String(h.id) === String(reserva.habitacionId))) {
          habitacionesBackend = [
            ...habitacionesBackend,
            {
              id: reserva.habitacionId,
              numero: reserva.numeroHabitacion || `Habitación ${reserva.habitacionId}`,
              // Puedes agregar más campos si lo deseas
            }
          ];
        }
        setHabitaciones(habitacionesBackend);
      } catch (err) {
        setError('No se pudieron cargar las habitaciones');
      }
    };
    fetchHabitaciones();
  }, [reservaId, reserva?.habitacionId, reserva?.numeroHabitacion]);

  const handleChange = (field, value) => {
    setReserva(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    setError('');
    try {
      const reservaData = {
        ...reserva,
        numPersonas: Number(reserva.numPersonas),
        habitacion: { id: reserva.habitacionId },
        huesped: { id: reserva.huespedId },
        usuario: reserva.usuarioId ? { id: reserva.usuarioId } : undefined,
      };
      await modificarReserva(reservaId, reservaData);
      alert('Reserva modificada exitosamente');
       navigate('/reservas'); // Redirige a la lista de reservas
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al modificar la reserva';
      setError(msg);
    }
  };

  if (loading) return <div>Cargando reserva...</div>;
  if (!reserva) return <div>No se encontró la reserva.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Modificar reserva</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Detalles de la reserva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Check-in
              </label>
              <input
                type="date"
                value={reserva.fechaCheckin || ''}
                onChange={e => handleChange('fechaCheckin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Check-out
              </label>
              <input
                type="date"
                value={reserva.fechaCheckout || ''}
                onChange={e => handleChange('fechaCheckout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={reserva.notas}
                onChange={e => handleChange('notas', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de la reserva
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habitación
              </label>
              <select
                value={reserva.habitacionId}
                onChange={e => {
                  const selected = habitaciones.find(h => String(h.id) === e.target.value);
                  handleChange('habitacionId', e.target.value);
                  handleChange('numeroHabitacion', selected ? selected.numero : '');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona una habitación</option>
                {habitaciones.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.numero} (ID: {h.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Huésped
              </label>
              <input
                type="number"
                value={reserva.huespedId}
                onChange={e => handleChange('huespedId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de habitación
              </label>
              <input
                type="text"
                value={reserva.numeroHabitacion || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleGuardar}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar Cambios
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModificarReserva;