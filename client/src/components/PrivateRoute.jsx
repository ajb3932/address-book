import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth();
    
    console.log('PrivateRoute state:', { isAuthenticated, loading });
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  }

export default PrivateRoute;