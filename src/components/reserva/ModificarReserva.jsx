import React, { useState, useEffect } from 'react';
import { modificarReserva, getReservaById } from '../../services/apiReservas';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModificarReserva = ({ reservaId }) => {
  const [reserva, setReserva] = useState(null);
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservaId || reservaId === 'undefined') {
      setError('ID de reserva inválido');
      return;
    }

    const fetchReserva = async () => {
      try {
        const data = await getReservaById(reservaId);
        setReserva({
          fechaCheckin: data.fechaCheckin,
          fechaCheckout: data.fechaCheckout,
          numPersonas: data.numPersonas,
          notas: data.notas || '',
          estadoReserva: data.estadoReserva || 'EN_CURSO',
          habitacionId: data.habitacion?.id || '',
          huespedId: data.huesped?.id || '',
          usuarioId: data.usuario?.id || '',
          numeroHabitacion: data.habitacion?.numero || '',
        });
      } catch {
        setError('Error al obtener la reserva');
      }
    };

    fetchReserva();
  }, [reservaId]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const res = await axios.get('http://localhost:8585/api/habitaciones');
        setHabitaciones(res.data);
      } catch {
        setError('No se pudieron cargar las habitaciones');
      }
    };

    fetchHabitaciones();
  }, []);

  const handleChange = (field, value) => {
    setReserva(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    setError('');
    if (!reserva.habitacionId || !reserva.huespedId || !reserva.usuarioId || !reserva.numeroHabitacion) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      const data = {
        ...reserva,
        numPersonas: Number(reserva.numPersonas),
        habitacion: { id: reserva.habitacionId },
        huesped: { id: reserva.huespedId },
        usuario: reserva.usuarioId ? { id: reserva.usuarioId } : undefined,
      };

      await modificarReserva(reservaId, data);
      alert('Reserva modificada exitosamente');
      navigate('/reservas');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al modificar la reserva';
      setError(msg);
    }
  };

  const handleCancelar = () => {
    navigate('/reservas');
  };

  if (!reserva) return <div className="text-gray-600 p-4">Cargando datos de la reserva...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Modificar reserva</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Habitación</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Huésped</label>
                <input
                  type="number"
                  value={reserva.huespedId}
                  onChange={e => handleChange('huespedId', e.target.value)}
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
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancelar}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Guardar cambios
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModificarReserva;
