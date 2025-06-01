import { useState, useEffect, useCallback } from 'react';
import { getReservas } from './apiReservas';
import { useNavigate, useLocation } from 'react-router-dom';

const habitaciones = ['101', '102', '103', '104', '105', '106', '107', '108', '109'];
const dias = Array.from({ length: 14 }, (_, i) => i + 1);

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [accion, setAccion] = useState(null); // 'modificar' o 'eliminar'
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cargarReservas = useCallback(async () => {
    try {
      const data = await getReservas();
      setReservas(data);
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con el servidor de reservas.');
    }
  }, []);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas, location]);

  // Busca la reserva para la celda
  const getReserva = (habitacion, dia) => reservas.find(r => String(r.habitacion?.id || r.habitacion) === habitacion && new Date(r.fechaCheckin).getDate() <= dia && new Date(r.fechaCheckout).getDate() >= dia);

  const handleClick = (habitacion, dia) => {
    const reserva = getReserva(habitacion, dia);
    if (reserva) {
      setReservaSeleccionada(reserva);
      setAccion(null);
    }
  };

  const handleAccion = (tipo) => {
    if (tipo === 'modificar' && reservaSeleccionada) {
      navigate(`/modificar/${reservaSeleccionada.id}`);
    } else if (tipo === 'eliminar' && reservaSeleccionada) {
      navigate(`/eliminar/${reservaSeleccionada.id}`);
    } else {
      setAccion(tipo);
    }
  };

  const cerrarModal = () => {
    setReservaSeleccionada(null);
    setAccion(null);
  };

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
              <a href="#" className="text-gray-700 hover:text-gray-900">Inicio</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Reservaciones</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Huesped</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Habitaciones</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Inventario</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Reportes</a>
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm" onClick={() => navigate('/crear-reserva')}>
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
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Calendario de Reservas</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1 bg-gray-100">Habitación</th>
                {dias.map(dia => (
                  <th key={dia} className="border border-gray-300 px-2 py-1 bg-gray-100">Jun {dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habitaciones.map(habitacion => (
                <tr key={habitacion}>
                  <td className="border border-gray-300 px-2 py-1 font-semibold bg-gray-50">{habitacion}</td>
                  {dias.map(dia => {
                    const reserva = getReserva(habitacion, dia);
                    return (
                      <td
                        key={dia}
                        className={`border border-gray-300 w-8 h-8 cursor-pointer text-center transition-colors duration-200 ${reserva ? 'bg-blue-500 text-white font-bold' : 'hover:bg-blue-100'}`}
                        onClick={() => handleClick(habitacion, dia)}
                      >
                        {reserva ? 'R' : <div className="w-4 h-4 mx-auto border rounded-sm"></div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal de opciones para la reserva seleccionada */}
      {reservaSeleccionada && !accion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reserva seleccionada</h3>
            <ul className="mb-4 text-gray-700 text-sm">
              <li><b>Habitación:</b> {reservaSeleccionada.habitacion?.id || reservaSeleccionada.habitacion}</li>
              <li><b>Check-in:</b> {reservaSeleccionada.fechaCheckin}</li>
              <li><b>Check-out:</b> {reservaSeleccionada.fechaCheckout}</li>
              <li><b>Estado:</b> {reservaSeleccionada.estadoReserva}</li>
            </ul>
            <div className="flex justify-end space-x-4">
              <button onClick={() => handleAccion('modificar')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Modificar</button>
              <button onClick={() => handleAccion('eliminar')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
              <button onClick={cerrarModal} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de modificar o eliminar */}
      {reservaSeleccionada && accion === 'modificar' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            {/* <ModificarReserva reservaId={reservaSeleccionada.id} /> */}
            <div className="flex justify-end mt-4">
              <button onClick={cerrarModal} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {reservaSeleccionada && accion === 'eliminar' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            {/* <EliminarReserva reservaId={reservaSeleccionada.id} /> */}
            <div className="flex justify-end mt-4">
              <button onClick={cerrarModal} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
