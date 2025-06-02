import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Calendar, CreditCard, Users, AlertCircle, DollarSign, 
  TrendingUp, Home, Clock, CheckCircle 
} from 'lucide-react';

const Reportes = () => {
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [resumenFinanciero, setResumenFinanciero] = useState(null);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [tasaOcupacion, setTasaOcupacion] = useState(0);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el token JWT
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const BASE_URL = 'http://localhost:8585';

  // Función para hacer peticiones con autenticación
  const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

    
    if (response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [estadisticas, financiero, actividad, ocupacion] = await Promise.all([
        fetchWithAuth('/api/reportes/estadisticas-generales'),
        fetchWithAuth('/api/reportes/resumen-financiero'),
        fetchWithAuth('/api/reportes/actividad-reciente?limite=10'),
        fetchWithAuth('/api/reportes/tasa-ocupacion')
      ]);

      setEstadisticasGenerales(estadisticas);
      setResumenFinanciero(financiero);
      setActividadReciente(actividad);
      setTasaOcupacion(ocupacion);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por período
  const filtrarPorPeriodo = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor selecciona ambas fechas');
      return;
    }

    try {
      setLoading(true);
      const [estadisticas, financiero] = await Promise.all([
        fetchWithAuth(`/api/reportes/estadisticas-periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
        fetchWithAuth(`/api/reportes/resumen-financiero?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
      ]);

      setEstadisticasGenerales(estadisticas);
      setResumenFinanciero(financiero);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{borderLeftColor: color}}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className="h-8 w-8" style={{color}} />
      </div>
    </div>
  );

  // Datos para gráficos
  const habitacionesData = estadisticasGenerales ? [
    { name: 'Disponibles', value: estadisticasGenerales.habitacionesDisponibles, color: '#10B981' },
    { name: 'Ocupadas', value: estadisticasGenerales.habitacionesOcupadas, color: '#F59E0B' },
    { name: 'Mantenimiento', value: estadisticasGenerales.habitacionesMantenimiento, color: '#EF4444' }
  ] : [];

  const reservasData = estadisticasGenerales ? [
    { name: 'Confirmadas', value: estadisticasGenerales.reservasConfirmadas },
    { name: 'Pendientes', value: estadisticasGenerales.reservasPendientes },
    { name: 'Canceladas', value: estadisticasGenerales.reservasCanceladas }
  ] : [];

  const financieroData = resumenFinanciero ? [
    { name: 'Ingresos del Período', value: parseFloat(resumenFinanciero.ingresosPeriodo || 0) },
    { name: 'Total Pagadas', value: parseFloat(resumenFinanciero.totalPagadas || 0) },
    { name: 'Pendientes', value: parseFloat(resumenFinanciero.facturasPendientes || 0) },
    { name: 'Vencidas', value: parseFloat(resumenFinanciero.facturasVencidas || 0) }
  ] : [];

  const getIconoActividad = (tipo) => {
    switch(tipo) {
      case 'RESERVA': return Calendar;
      case 'PAGO': return CreditCard;
      case 'CHECKIN': return Users;
      case 'MANTENIMIENTO': return AlertCircle;
      default: return Clock;
    }
  };

  const getColorTipo = (tipo) => {
    switch(tipo) {
      case 'RESERVA': return 'bg-blue-100 text-blue-800';
      case 'PAGO': return 'bg-green-100 text-green-800';
      case 'CHECKIN': return 'bg-purple-100 text-purple-800';
      case 'MANTENIMIENTO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={cargarDatos}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Reportes</h1>
          <p className="text-gray-600">Resumen ejecutivo del hotel</p>
        </div>

        {/* Filtros de fecha */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filtros de Período</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={filtrarPorPeriodo}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Filtrar
            </button>
            <button
              onClick={cargarDatos}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Resetear
            </button>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tasa de Ocupación"
            value={`${tasaOcupacion.toFixed(1)}%`}
            icon={TrendingUp}
            color="#10B981"
          />
          <StatCard
            title="Total Habitaciones"
            value={estadisticasGenerales?.totalHabitaciones}
            icon={Home}
            color="#3B82F6"
          />
          <StatCard
            title="Reservas Totales"
            value={estadisticasGenerales?.totalReservas}
            icon={Calendar}
            color="#8B5CF6"
          />
          <StatCard
            title="Huéspedes Activos"
            value={estadisticasGenerales?.huespedesActivos}
            icon={Users}
            color="#F59E0B"
          />
        </div>

        {/* Estadísticas financieras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Ingresos del Período"
            value={`$${resumenFinanciero?.ingresosPeriodo?.toLocaleString() || '0'}`}
            icon={DollarSign}
            color="#10B981"
          />
          <StatCard
            title="Total Pagadas"
            value={`$${resumenFinanciero?.totalPagadas?.toLocaleString() || '0'}`}
            icon={CheckCircle}
            color="#3B82F6"
          />
          <StatCard
            title="Facturas Pendientes"
            value={`$${resumenFinanciero?.facturasPendientes?.toLocaleString() || '0'}`}
            icon={Clock}
            color="#F59E0B"
          />
          <StatCard
            title="Facturas Vencidas"
            value={`$${resumenFinanciero?.facturasVencidas?.toLocaleString() || '0'}`}
            icon={AlertCircle}
            color="#EF4444"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de habitaciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de Habitaciones</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={habitacionesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {habitacionesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de reservas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de Reservas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reservasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financieroData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Monto']} />
              <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {actividadReciente.map((actividad, index) => {
              const IconoActividad = getIconoActividad(actividad.tipo);
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${getColorTipo(actividad.tipo)}`}>
                    <IconoActividad className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{actividad.mensaje}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(actividad.fecha).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColorTipo(actividad.tipo)}`}>
                    {actividad.tipo}
                  </span>
                </div>
              );
            })}
            {actividadReciente.length === 0 && (
              <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;