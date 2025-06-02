import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHuespedes } from '../../services/apiHuesped';
import { Search, Plus, Edit, Trash2, User, Mail, Phone, MapPin } from 'lucide-react';

const ListarHuespedes = () => {
  const [huespedes, setHuespedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHuespedes, setFilteredHuespedes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarHuespedes();
  }, []);

  useEffect(() => {
    filtrarHuespedes();
  }, [huespedes, searchTerm]);

  const cargarHuespedes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getHuespedes();
      setHuespedes(data);
    } catch (err) {
      setError('Error al cargar los huéspedes');
    } finally {
      setLoading(false);
    }
  };

  const filtrarHuespedes = () => {
    if (!searchTerm) {
      setFilteredHuespedes(huespedes);
      return;
    }

    const filtered = huespedes.filter(huesped => 
      huesped.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.documentoIdentidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.telefono.includes(searchTerm)
    );
    setFilteredHuespedes(filtered);
  };

  const handleNuevoHuesped = () => {
    navigate('/huespedes/crear');
  };

  const handleEditarHuesped = (id) => {
    navigate(`/huespedes/modificar/${id}`);
  };

  const handleEliminarHuesped = (id) => {
    navigate(`/huespedes/eliminar/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando huéspedes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Gestión de Huéspedes</h1>
            <p className="text-gray-600 mt-2">Administra los huéspedes del hotel</p>
          </div>
          <button
            onClick={handleNuevoHuesped}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Huésped
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-900 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, email, documento o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Mostrando {filteredHuespedes.length} de {huespedes.length} huéspedes
          </div>
        </div>

        {/* Lista de huéspedes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredHuespedes.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No se encontraron huéspedes' : 'No hay huéspedes registrados'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando un nuevo huésped'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={handleNuevoHuesped}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Huésped
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Huésped
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHuespedes.map((huesped) => (
                    <tr key={huesped.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {huesped.nombre} {huesped.apellido}
                            </div>
                            <div className="text-sm text-gray-500">ID: {huesped.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            {huesped.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {huesped.telefono}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{huesped.tipoDocumento}</div>
                          <div className="text-gray-500">{huesped.documentoIdentidad}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div>{huesped.ciudad}, {huesped.pais}</div>
                              <div className="text-gray-500 text-xs">{huesped.direccion}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditarHuesped(huesped.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Editar huésped"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEliminarHuesped(huesped.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Eliminar huésped"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        {huespedes.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Estadísticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{huespedes.length}</div>
                <div className="text-blue-700">Total Huéspedes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(huespedes.map(h => h.pais)).size}
                </div>
                <div className="text-green-700">Países</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(huespedes.map(h => h.ciudad)).size}
                </div>
                <div className="text-purple-700">Ciudades</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarHuespedes;