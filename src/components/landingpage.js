import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios';

// Funciones de API para reservas
const getReservas = async () => {
  const response = await axios.get('http://localhost:8585/api/reservas');
  return response.data;
};

const eliminarReserva = async (id) => {
  await axios.delete(`http://localhost:8585/api/reservas/${id}`);
};

const cancelarReserva = async (id) => {
  await axios.put(`http://localhost:8585/api/reservas/${id}/cancelar`);
};

const checkInReserva = async (id) => {
  await axios.put(`http://localhost:8585/api/reservas/${id}/checkin`);
};

const checkOutReserva = async (id) => {
  await axios.put(`http://localhost:8585/api/reservas/${id}/checkout`);
};

// Servicio para habitaciones
const getHabitaciones = async () => {
  const response = await axios.get('http://localhost:8585/api/habitaciones');
  return response.data;
};

// Generar días del mes actual
const generarDiasDelMes = () => {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  
  return Array.from({ length: diasEnMes }, (_, i) => ({
    dia: i + 1,
    fecha: new Date(año, mes, i + 1)
  }));
};

export default function CalendarioReservas() {
  const navigate = useNavigate(); // Hook para navegación
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [accion, setAccion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diasDelMes] = useState(generarDiasDelMes());

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar reservas y habitaciones en paralelo
      const [reservasData, habitacionesData] = await Promise.all([
        getReservas(),
        getHabitaciones()
      ]);
      
      setReservas(reservasData);
      setHabitaciones(habitacionesData);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Busca la reserva para la celda específica
  const getReserva = (numeroHabitacion, fecha) => {
    return reservas.find(r => {
      const habitacionReserva = String(r.numeroHabitacion);
      const checkin = new Date(r.fechaCheckin);
      const checkout = new Date(r.fechaCheckout);
      
      return habitacionReserva === numeroHabitacion && 
             fecha >= checkin && 
             fecha < checkout; // < para que checkout no esté incluido
    });
  };

  // Obtiene el color de la celda según el estado de la reserva
  const getCellColor = (reserva) => {
    if (!reserva) return 'hover:bg-blue-50 transition-colors duration-200';
    
    switch (reserva.estadoReserva) {
      case 'CONFIRMADA':
        return 'bg-green-500 text-white hover:bg-green-600 transition-colors duration-200';
      case 'EN_CURSO':
        return 'bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200';
      case 'FINALIZADA':
        return 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200';
      case 'CANCELADA':
        return 'bg-red-500 text-white hover:bg-red-600 transition-colors duration-200';
      default:
        return 'bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200';
    }
  };

  const handleClick = (numeroHabitacion, fecha) => {
    const reserva = getReserva(numeroHabitacion, fecha);
    if (reserva) {
      setReservaSeleccionada(reserva);
      setAccion(null);
    }
  };

  const handleAccion = async (tipo) => {
    if (!reservaSeleccionada) return;

    try {
      setError(null);
      
      switch (tipo) {
        case 'modificar':
          // Navegar a la página de modificar reserva
          navigate(`/reservas/modificar/${reservaSeleccionada.id}`);
          break;
          
        case 'eliminar':
          // Navegar a la página de eliminar reserva
          navigate(`/reservas/eliminar/${reservaSeleccionada.id}`);
          break;
          
        case 'cancelar':
          if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            await cancelarReserva(reservaSeleccionada.id);
            // Actualizar el estado local
            setReservas(prev => prev.map(r => 
              r.id === reservaSeleccionada.id 
                ? { ...r, estadoReserva: 'CANCELADA' }
                : r
            ));
            cerrarModal();
            alert('Reserva cancelada exitosamente');
          }
          break;
          
        case 'checkin':
          if (window.confirm('¿Realizar check-in para esta reserva?')) {
            await checkInReserva(reservaSeleccionada.id);
            setReservas(prev => prev.map(r => 
              r.id === reservaSeleccionada.id 
                ? { ...r, estadoReserva: 'EN_CURSO' }
                : r
            ));
            cerrarModal();
            alert('Check-in realizado exitosamente');
          }
          break;
          
        case 'checkout':
          if (window.confirm('¿Realizar check-out para esta reserva?')) {
            await checkOutReserva(reservaSeleccionada.id);
            setReservas(prev => prev.map(r => 
              r.id === reservaSeleccionada.id 
                ? { ...r, estadoReserva: 'FINALIZADA' }
                : r
            ));
            cerrarModal();
            alert('Check-out realizado exitosamente');
          }
          break;
          
        default:
          setAccion(tipo);
      }
    } catch (err) {
      setError(err.message || 'Error al realizar la acción');
    }
  };

  const handleNuevaReserva = () => {
    // Navegar a la página de crear nueva reserva
    navigate('/reservas/crear');
  };

  const cerrarModal = () => {
    setReservaSeleccionada(null);
    setAccion(null);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const obtenerNombreMes = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span className="text-gray-800 font-medium">Grupo Montaña</span>
            </div>
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <button onClick={() => navigate('/')} className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Inicio
              </button>
              <button onClick={() => navigate('/reservas')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                Reservaciones
              </button>
              <button onClick={() => navigate('/huespedes')} className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Huésped
              </button>
              <button onClick={() => navigate('/habitaciones')} className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Habitaciones
              </button>
              <button onClick={() => navigate('/inventario')} className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Inventario
              </button>
              <button onClick={() => navigate('/reportes')} className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Reportes
              </button>
              <button 
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors duration-200" 
                onClick={handleNuevaReserva}
              >
                Nueva Reserva
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">C</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Calendario de Reservas - {obtenerNombreMes()}
          </h1>
          <button 
            onClick={cargarDatos}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-900 hover:text-red-700 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Leyenda */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Leyenda:</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Confirmada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>En Curso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Finalizada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Cancelada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
              <span>Disponible</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-3 py-2 bg-gray-100 text-left">Habitación</th>
                {diasDelMes.map(({ dia, fecha }) => (
                  <th key={dia} className="border border-gray-300 px-2 py-2 bg-gray-100 text-center min-w-[40px]">
                    <div className="text-xs font-medium">
                      {fecha.toLocaleDateString('es-ES', { month: 'short' })}
                    </div>
                    <div className="text-sm font-bold">{dia}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habitaciones.map(habitacion => (
                <tr key={habitacion.id}>
                  <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50 text-center">
                    {habitacion.numero}
                  </td>
                  {diasDelMes.map(({ dia, fecha }) => {
                    const reserva = getReserva(String(habitacion.numero), fecha);
                    return (
                      <td
                        key={dia}
                        className={`border border-gray-300 w-10 h-10 cursor-pointer text-center ${getCellColor(reserva)}`}
                        onClick={() => handleClick(String(habitacion.numero), fecha)}
                        title={reserva ? `Habitación ${reserva.numeroHabitacion} - ${reserva.estadoReserva} - ${reserva.numPersonas} personas` : 'Disponible'}
                      >
                        {reserva ? (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-xs font-bold">R</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de reservas */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Resumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded hover:bg-green-100 transition-colors duration-200">
              <div className="text-2xl font-bold text-green-600">
                {reservas.filter(r => r.estadoReserva === 'CONFIRMADA').length}
              </div>
              <div className="text-green-700">Confirmadas</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors duration-200">
              <div className="text-2xl font-bold text-yellow-600">
                {reservas.filter(r => r.estadoReserva === 'EN_CURSO').length}
              </div>
              <div className="text-yellow-700">En Curso</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors duration-200">
              <div className="text-2xl font-bold text-blue-600">
                {reservas.filter(r => r.estadoReserva === 'FINALIZADA').length}
              </div>
              <div className="text-blue-700">Finalizadas</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded hover:bg-red-100 transition-colors duration-200">
              <div className="text-2xl font-bold text-red-600">
                {reservas.filter(r => r.estadoReserva === 'CANCELADA').length}
              </div>
              <div className="text-red-700">Canceladas</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200">
              <div className="text-2xl font-bold text-gray-600">{reservas.length}</div>
              <div className="text-gray-700">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de opciones para la reserva seleccionada */}
      {reservaSeleccionada && !accion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 scale-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Reserva</h3>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">ID:</span>
                <span>{reservaSeleccionada.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Habitación:</span>
                <span>{reservaSeleccionada.numeroHabitacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Huésped ID:</span>
                <span>{reservaSeleccionada.huespedId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Personas:</span>
                <span>{reservaSeleccionada.numPersonas}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Check-in:</span>
                <span>{formatearFecha(reservaSeleccionada.fechaCheckin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Check-out:</span>
                <span>{formatearFecha(reservaSeleccionada.fechaCheckout)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Estado:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  reservaSeleccionada.estadoReserva === 'CONFIRMADA' ? 'bg-green-100 text-green-800' :
                  reservaSeleccionada.estadoReserva === 'EN_CURSO' ? 'bg-yellow-100 text-yellow-800' :
                  reservaSeleccionada.estadoReserva === 'FINALIZADA' ? 'bg-blue-100 text-blue-800' :
                  reservaSeleccionada.estadoReserva === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {reservaSeleccionada.estadoReserva}
                </span>
              </div>
              {reservaSeleccionada.notas && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Notas:</span>
                  <span className="text-right max-w-xs">{reservaSeleccionada.notas}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button 
                onClick={() => handleAccion('modificar')} 
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm"
              >
                Modificar
              </button>
              {reservaSeleccionada.estadoReserva === 'CONFIRMADA' && (
                <button 
                  onClick={() => handleAccion('checkin')} 
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  Check-in
                </button>
              )}
              {reservaSeleccionada.estadoReserva === 'EN_CURSO' && (
                <button 
                  onClick={() => handleAccion('checkout')} 
                  className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200 text-sm"
                >
                  Check-out
                </button>
              )}
              {['CONFIRMADA', 'EN_CURSO'].includes(reservaSeleccionada.estadoReserva) && (
                <button 
                  onClick={() => handleAccion('cancelar')} 
                  className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200 text-sm"
                >
                  Cancelar
                </button>
              )}
              <button 
                onClick={() => handleAccion('eliminar')} 
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                Eliminar
              </button>
              <button 
                onClick={cerrarModal} 
                className="px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}