import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PageHeader({ 
  title, 
  breadcrumbs = [], 
  actionText = '', 
  actionIcon = null,
  onActionClick = null 
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
        
        {actionText && onActionClick && (
          <Button
            variant="contained"
            color="primary"
            startIcon={actionIcon}
            onClick={onActionClick}
          >
            {actionText}
          </Button>
        )}
      </Box>
      
      {breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography key={index} color="text.primary">
                {item.label}
              </Typography>
            ) : (
              <Link
                key={index}
                color="inherit"
                component="button"
                onClick={() => navigate(item.path)}
                underline="hover"
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
    </Box>
  );
}

export default PageHeader;