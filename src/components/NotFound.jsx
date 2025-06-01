import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { ArrowLeft, Home } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 5
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '5rem', md: '8rem' },
            mb: 2
          }}
        >
          404
        </Typography>

        <Typography 
          variant="h4" 
          component="h2"
          sx={{ mb: 3 }}
        >
          Página no encontrada
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: 'md', 
            mb: 5,
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Por favor, verifica la URL o regresa a la página principal.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowLeft />}
            onClick={() => navigate(-1)}
          >
            Volver Atrás
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Ir al Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default NotFound;