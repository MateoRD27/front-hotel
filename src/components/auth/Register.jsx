import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, TextField, Button, Typography, Container, Paper, 
  InputAdornment, IconButton, Link, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Hotel } from 'lucide-react';

function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      nombreUsuario: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'RECEPCIONISTA'
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    // Remove confirmPassword before sending to the API
    const { confirmPassword, ...userData } = data;
    
    try {
      const success = await authRegister(userData);
      if (success) {
        toast.success('¡Registro exitoso! Por favor inicie sesión.');
        navigate('/login');
      } else {
        setError('No se pudo completar el registro. Intente nuevamente.');
      }
    } catch (err) {
      setError('Error en el registro. Por favor intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Hotel size={32} />
            <Typography component="h1" variant="h5">
              Sistema de Gestión Hotelera
            </Typography>
          </Box>
          
          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            Registro de Usuario
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3, width: '100%' }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                id="nombre"
                label="Nombre"
                {...register("nombre", { 
                  required: "Este campo es requerido" 
                })}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
              
              <TextField
                fullWidth
                id="apellido"
                label="Apellido"
                {...register("apellido", { 
                  required: "Este campo es requerido" 
                })}
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
              />
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="nombreUsuario"
              label="Nombre de Usuario"
              {...register("nombreUsuario", { 
                required: "Este campo es requerido",
                minLength: {
                  value: 4,
                  message: "El nombre de usuario debe tener al menos 4 caracteres"
                }
              })}
              error={!!errors.nombreUsuario}
              helperText={errors.nombreUsuario?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Este campo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo inválida"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              {...register("password", {
                required: "Este campo es requerido",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirmar Contraseña"
              type={showPassword ? 'text' : 'password'}
              {...register("confirmPassword", {
                required: "Este campo es requerido",
                validate: value => value === password || "Las contraseñas no coinciden"
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                id="rol"
                label="Rol"
                {...register("rol", { required: true })}
              >
                <MenuItem value="ADMIN">Administrador</MenuItem>
                <MenuItem value="RECEPCIONISTA">Recepcionista</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Registrarse"}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tiene una cuenta?{' '}
                <Link component={RouterLink} to="/login">
                  Iniciar Sesión
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;