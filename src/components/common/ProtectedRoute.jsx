import { Navigate, Outlet } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ 
  isAllowed, 
  redirectPath = '/login', 
  children 
}) {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;