import axios from 'axios';

// Obtener todas las reservas
export const getReservas = async () => {
  const response = await axios.get('http://localhost:8585/api/reservas');
  return response.data;
};

// Obtener reserva por ID
export const getReservaById = async (id) => {
  const response = await axios.get(`http://localhost:8585/api/reservas/${id}`);
  return response.data;
};

// Crear reserva
export const crearReserva = async (reserva) => {
  const response = await axios.post('http://localhost:8585/api/reservas', reserva);
  return response.data;
};

// Modificar reserva
export const modificarReserva = async (id, reserva) => {
  const response = await axios.put(`http://localhost:8585/api/reservas/${id}`, reserva);
  return response.data;
};

// Cancelar reserva
export const cancelarReserva = async (id) => {
  await axios.put(`http://localhost:8585/api/reservas/${id}/cancelar`);
};

// Eliminar reserva
export const eliminarReserva = async (id) => {
  await axios.delete(`http://localhost:8585/api/reservas/${id}`);
};

// Listar reservas por usuario
export const getReservasPorUsuario = async (usuarioId) => {
  const response = await axios.get(`http://localhost:8585/api/reservas/usuario/${usuarioId}`);
  return response.data;
};

// Check-in
export const checkInReserva = async (id) => {
  await axios.put(`http://localhost:8585/api/reservas/${id}/checkin`);
};

// Check-out
export const checkOutReserva = async (id) => {
  await axios.put(`http://localhost:8585/api/reservas/${id}/checkout`);
};