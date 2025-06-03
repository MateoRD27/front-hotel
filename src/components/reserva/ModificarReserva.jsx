import React, { useState, useEffect } from 'react';
import { modificarReserva, getReservaById } from '../../services/apiReservas';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModificarReserva = ({ reservaId }) => {
  const [reserva, setReserva] = useState(null);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Cargar datos de la reserva
  useEffect(() => {
    if (!reservaId || reservaId === 'undefined') {
      setError('ID de reserva inválido');
      setLoading(false);
      return;
    }

    const fetchReserva = async () => {
      try {
        const data = await getReservaById(reservaId);
        setReserva({
          ...data,
          habitacionId: data.habitacion?.id || '',
          numeroHabitacion: data.habitacion?.numero || '',
          huespedId: data.huesped?.id || '',
          usuarioId: data.usuario?.id || '',
        });
      } catch {
        setError('Error al obtener la reserva');
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [reservaId]);

  // Cargar lista de habitaciones
  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const res = await axios.get('http://localhost:8585/api/habitaciones');
        let habitacionesBackend = res.data;

        // Asegura que la habitación actual esté en la lista
        if (
          reserva &&
          reserva.habitacionId &&
          !habitacionesBackend.some(h => String(h.id) === String(reserva.habitacionId))
        ) {
          habitacionesBackend.push({
            id: reserva.habitacionId,
            numero: reserva.numeroHabitacion || `Habitación ${reserva.habitacionId}`,
          });
        }

        setHabitaciones(habitacionesBackend);
      } catch {
        setError('No se pudieron cargar las habitaciones');
      }
    };

    if (reserva) fetchHabitaciones();
  }, [reserva]);

  const handleChange = (field, value) => {
    setReserva(prev => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    setError('');
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

  if (loading) return <div>Cargando reserva...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!reserva) return <div>No se encontró la reserva.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Modificar reserva</h1>
      <div className="bg-white shadow rounded-lg p-6">
      </div>
    </div>
  );
};

export default ModificarReserva;
