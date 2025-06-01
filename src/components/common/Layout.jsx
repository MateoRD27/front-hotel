import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Box, Divider, Avatar, 
  Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft, Hotel, User, Users, Calendar, Receipt, 
  CreditCard, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
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
  
  // Menu items - filter based on user role
  const menuItems = [
    { text: 'Dashboard', icon: <Hotel size={20} />, path: '/', role: ['ADMIN', 'RECEPCIONISTA'] },
    { text: 'Usuarios', icon: <User size={20} />, path: '/usuarios', role: ['ADMIN'] },
    { text: 'Habitaciones', icon: <Hotel size={20} />, path: '/habitaciones', role: ['ADMIN', 'RECEPCIONISTA'] },
    { text: 'Tipos de habitación', icon: <Settings size={20} />, path: '/tipos-habitacion', role: ['ADMIN', 'RECEPCIONISTA'] },
    { text: 'Huéspedes', icon: <Users size={20} />, path: '/huespedes', role: ['ADMIN', 'RECEPCIONISTA'] },
    { text: 'Reservas', icon: <Calendar size={20} />, path: '/reservas', role: ['ADMIN', 'RECEPCIONISTA'] },
    { text: 'Calendario', icon: <Calendar size={20} />, path: '/reservas/calendario', role: ['ADMIN', 'RECEPCIONISTA'] },
    { text: 'Facturas', icon: <Receipt size={20} />, path: '/facturas', role: ['ADMIN', 'RECEPCIONISTA'] }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: DRAWER_WIDTH,
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión Hotelera
          </Typography>
          
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.nombre?.charAt(0) || user?.nombreUsuario?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user?.nombre} {user?.apellido}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="textSecondary">
                {user?.rol}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>
              <ListItemText>Cerrar sesión</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? DRAWER_WIDTH : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : 64,
            boxSizing: 'border-box',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.filter(item => item.role.includes(user?.rol)).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: open ? 1 : 0 }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;