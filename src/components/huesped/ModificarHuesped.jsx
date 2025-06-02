import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { actualizarHuesped, getHuespedById } from '../../services/apiHuesped';
import { User, Mail, Phone, MapPin, FileText, CreditCard } from 'lucide-react';

const ModificarHuesped = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [huesped, setHuesped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const tiposDocumento = [
    { value: 'CEDULA', label: 'Cédula' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
    { value: 'LICENCIA', label: 'Licencia de Conducir' },
    { value: 'OTRO', label: 'Otro' }
  ];

  useEffect(() => {
    const cargarHuesped = async () => {
      try {
        setError('');
        setLoading(true);
        const data = await getHuespedById(id);
        setHuesped(data);
      } catch (error) {
        setError('Error al cargar la información del huésped');
        console.error('Error al obtener huésped:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarHuesped();
  }, [id]);

  const handleChange = (field, value) => {
    setHuesped(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'nombre', 'apellido', 'email', 'telefono',
      'direccion', 'ciudad', 'pais', 'documentoIdentidad', 'tipoDocumento'
    ];

    for (const field of requiredFields) {
      if (!huesped[field] || huesped[field].toString().trim() === '') {
        return `El campo ${field} es requerido`;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(huesped.email)) {
      return 'El email no tiene un formato válido';
    }

    return null;
  };

  const handleGuardar = async () => {
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const huespedData = {
        ...huesped,
        nombre: huesped.nombre.trim(),
        apellido: huesped.apellido.trim(),
        email: huesped.email.trim().toLowerCase(),
        telefono: huesped.telefono.trim(),
        direccion: huesped.direccion.trim(),
        ciudad: huesped.ciudad.trim(),
        pais: huesped.pais.trim(),
        documentoIdentidad: huesped.documentoIdentidad.trim(),
        notas: huesped.notas?.trim() || ''
      };

      await actualizarHuesped(id, huespedData);
      alert('Huésped actualizado exitosamente');
      navigate('/huespedes');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al actualizar el huésped';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = () => {
    navigate('/huespedes');
  };

  if (loading) return <div className="p-4">Cargando datos del huésped...</div>;

  if (!huesped) return <div className="p-4 text-red-500">No se encontró el huésped</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Modificar Huésped</h1>
          <p className="text-gray-600 mt-2">Actualiza la información del huésped</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {/* Secciones reutilizadas del formulario de CrearHuesped */}
          {/* Puedes copiar aquí los mismos campos y componentes JSX de CrearHuesped, usando huesped y handleChange */}

          {/* Ejemplo de campos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input
              type="text"
              value={huesped.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el nombre"
            />
          </div>

          {/* ... aquí repite el resto del formulario de CrearHuesped, adaptando el value y onChange como arriba */}

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancelar}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
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

export default ModificarHuesped;
