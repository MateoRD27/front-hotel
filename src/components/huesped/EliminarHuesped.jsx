import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eliminarHuesped, getHuespedById } from '../../services/apiHuesped';

const EliminarHuesped = () => {
  const { id } = useParams(); // El id del huésped viene por la URL
  const [huesped, setHuesped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHuesped = async () => {
      try {
        const data = await getHuespedById(id);
        setHuesped(data);
      } catch (error) {
        alert('Error al obtener el huésped');
      } finally {
        setLoading(false);
      }
    };
    fetchHuesped();
  }, [id]);

  const handleEliminar = async () => {
    setError('');
    try {
      await eliminarHuesped(id);
      alert('Huésped eliminado exitosamente');
      navigate('/huespedes'); // Redirige a la lista de huéspedes
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al eliminar el huésped';
      setError(msg);
    }
  };

  if (loading) return <div>Cargando información del huésped...</div>;
  if (!huesped) return <div>No se encontró el huésped.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-red-600">Eliminar Huésped</h2>
      <p className="mb-4">¿Estás seguro que deseas eliminar el siguiente huésped?</p>
      <ul className="text-sm text-gray-700 space-y-1 mb-4">
        <li><b>Nombre:</b> {huesped.nombre} {huesped.apellido}</li>
        <li><b>Email:</b> {huesped.email}</li>
        <li><b>Teléfono:</b> {huesped.telefono}</li>
        <li><b>Documento:</b> {huesped.tipoDocumento} {huesped.documentoIdentidad}</li>
        <li><b>Dirección:</b> {huesped.direccion}, {huesped.ciudad}, {huesped.pais}</li>
        {huesped.notas && <li><b>Notas:</b> {huesped.notas}</li>}
      </ul>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/huespedes')}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={handleEliminar}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default EliminarHuesped;
