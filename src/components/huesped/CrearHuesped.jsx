import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearHuesped } from '../../services/apiHuesped';
import { User, Mail, Phone, MapPin, FileText, CreditCard } from 'lucide-react';

const CrearHuesped = () => {
  const [huesped, setHuesped] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    documentoIdentidad: '',
    tipoDocumento: 'CEDULA',
    notas: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tiposDocumento = [
    { value: 'CEDULA', label: 'Cédula' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
    { value: 'LICENCIA', label: 'Licencia de Conducir' },
    { value: 'OTRO', label: 'Otro' }
  ];

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

    // Validar email
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
      setLoading(true);
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
        notas: huesped.notas.trim()
      };

      await crearHuesped(huespedData);
      alert('Huésped creado exitosamente');
      navigate('/huespedes');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al crear el huésped';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate('/huespedes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Crear Nuevo Huésped</h1>
          <p className="text-gray-600 mt-2">Ingresa la información del huésped</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-8">
            {/* Información Personal */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Información Personal</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={huesped.nombre}
                    onChange={e => handleChange('nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingrese el nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={huesped.apellido}
                    onChange={e => handleChange('apellido', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingrese el apellido"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Información de Contacto</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={huesped.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={huesped.telefono}
                    onChange={e => handleChange('telefono', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Dirección</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={huesped.direccion}
                    onChange={e => handleChange('direccion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Calle 123 # 45-67"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={huesped.ciudad}
                      onChange={e => handleChange('ciudad', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bogotá"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <input
                      type="text"
                      value={huesped.pais}
                      onChange={e => handleChange('pais', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Colombia"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Documento de Identidad */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Documento de Identidad</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    value={huesped.tipoDocumento}
                    onChange={e => handleChange('tipoDocumento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    value={huesped.documentoIdentidad}
                    onChange={e => handleChange('documentoIdentidad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12345678"
                  />
                </div>
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Notas Adicionales</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={huesped.notas}
                  onChange={e => handleChange('notas', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Información adicional sobre el huésped..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancelar}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Huésped'}
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

export default CrearHuesped;