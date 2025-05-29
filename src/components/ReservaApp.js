import React, { useState } from 'react';
import CrearReserva from './CrearReserva';
import ModificarReserva from './ModificarReserva';
import EliminarReserva from './EliminarReserva';

const ReservaApp = () => {
  const [currentView, setCurrentView] = useState('crear');

  const renderComponent = () => {
    switch (currentView) {
      case 'crear':
        return <CrearReserva />;
      case 'modificar':
        return <ModificarReserva />;
      case 'eliminar':
        return <EliminarReserva />;
      default:
        return <CrearReserva />;
    }
  };

  return (
    <div>
      {/* Selector de vista para demostración */}
      <div className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Vista Demo:</h3>
        <div className="space-y-2">
          <button
            onClick={() => setCurrentView('crear')}
            className={`block w-full text-left px-3 py-2 rounded ${currentView === 'crear' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Crear Reserva
          </button>
          <button
            onClick={() => setCurrentView('modificar')}
            className={`block w-full text-left px-3 py-2 rounded ${currentView === 'modificar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Modificar Reserva
          </button>
          <button
            onClick={() => setCurrentView('eliminar')}
            className={`block w-full text-left px-3 py-2 rounded ${currentView === 'eliminar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Eliminar Reserva
          </button>
        </div>
      </div>
      {/* Componente actual */}
      {renderComponent()}
    </div>
  );
};

export default ReservaApp;