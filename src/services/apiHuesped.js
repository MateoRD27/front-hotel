import axios from 'axios';

// Obtener todos los huéspedes
export const getHuespedes = async () => {
  const response = await axios.get('http://localhost:8585/api/huespedes');
  return response.data;
};

// Obtener huésped por ID
export const getHuespedById = async (id) => {
  const response = await axios.get(`http://localhost:8585/api/huespedes/${id}`);
  return response.data;
};

// Crear huésped
export const crearHuesped = async (huesped) => {
  const response = await axios.post('http://localhost:8585/api/huespedes', huesped);
  return response.data;
};

// Actualizar huésped
export const actualizarHuesped = async (id, huesped) => {
  const response = await axios.put(`http://localhost:8585/api/huespedes/${id}`, huesped);
  return response.data;
};

// Eliminar huésped
export const eliminarHuesped = async (id) => {
  await axios.delete(`http://localhost:8585/api/huespedes/${id}`);
};