import React, { useState, useEffect } from 'react';
import { eliminarReserva, getReservaById } from './apiReservas';

const EliminarReserva = ({ reservaId }) => {
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const data = await getReservaById(reservaId);
        setReserva(data);
      } catch (error) {
        alert('Error al obtener la reserva');
      } finally {
        setLoading(false);
      }
    };
    fetchReserva();
  }, [reservaId]);

  const handleEliminar = async () => {
    try {
      await eliminarReserva(reservaId);
      alert('Reserva eliminada exitosamente');
      // Redirigir o actualizar la lista si es necesario
    } catch (error) {
      alert('Error al eliminar la reserva');
    }
  };

  if (loading) return <div>Cargando reserva...</div>;
  if (!reserva) return <div>No se encontró la reserva.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Eliminar Reserva</h2>
      <p>¿Estás seguro que deseas eliminar la siguiente reserva?</p>
      <ul className="my-4 text-sm text-gray-700">
        <li><b>Check-in:</b> {reserva.fechaCheckin}</li>
        <li><b>Check-out:</b> {reserva.fechaCheckout}</li>
        <li><b>Número de personas:</b> {reserva.numPersonas}</li>
        <li><b>Notas:</b> {reserva.notas}</li>
        <li><b>Estado:</b> {reserva.estadoReserva}</li>
        <li><b>ID Habitación:</b> {reserva.habitacion?.id}</li>
        <li><b>ID Huésped:</b> {reserva.huesped?.id}</li>
        <li><b>ID Usuario:</b> {reserva.usuario?.id}</li>
      </ul>
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleEliminar}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default EliminarReserva;