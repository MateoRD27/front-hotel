import { useNavigate, Outlet,  useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider, Button } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const handleNuevaReserva = () => {
    navigate('/reservas/crear');
  };

return (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
    <AppBar position="fixed" elevation={1} sx={{ backgroundColor: '#fff', color: '#111' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, backgroundColor: '#111', borderRadius: '50%' }} />
          <Typography variant="subtitle1" fontWeight={500}>Grupo Montaña</Typography>
        </Box>

        {/* Navegación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {[
            { label: 'Inicio', path: '/' },
            { label: 'Reservaciones', path: '/reservas' },
            { label: 'Huéspedes', path: '/huespedes' },
            { label: 'Habitaciones', path: '/habitaciones' },
            { label: 'Reportes', path: '/reportes' },
            { label: 'Inventario', path: '/inventario' },
          ].map(({ label, path }) => {
            const isActive = currentPath === path;
            return (
              <Button
                key={path}
                onClick={() => navigate(path)}
                color="inherit"
                sx={{
                  textTransform: 'capitalize',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  
                  textDecoration: 'none',
                  borderRadius: 0,
                  color: isActive ? '#000' : '#1a202c',
                  '&:hover': {
                    color: '#000',
                    borderBottom: '2px solid #1a202c',
                    backgroundColor: 'transparent',
                    textDecoration: 'none',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}

          {/* Botón de acción */}
          <Button
            onClick={handleNuevaReserva}
            variant="contained"
            sx={{
              backgroundColor: '#111827',
              color: '#fff',
              fontSize: '0.875rem',
              textTransform: 'capitalize',
              fontWeight: 500,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#1f2937',
              },
            }}
          >
            Nueva Reserva
          </Button>

          {/* Avatar */}
          <IconButton onClick={handleAvatarClick} sx={{ ml: 1 }}>
            <Avatar sx={{ bgcolor: '#e2e8f0', color: '#2d3748', fontWeight: 600 }}>
              {user?.nombre?.charAt(0) || user?.nombreUsuario?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.nombre} {user?.apellido}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="textSecondary">{user?.rol}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogOut size={18} style={{ marginRight: 8 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>

    {/* Contenido principal */}
    <Box component="main" sx={{ padding: 3, marginTop: '64px' }}>
      <Outlet />
    </Box>
  </Box>
);


}

export default Layout;
