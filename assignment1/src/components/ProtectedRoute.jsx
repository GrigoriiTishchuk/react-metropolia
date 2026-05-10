import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../hooks/contextHooks';

/**
 * Wrapper component that redirects unauthenticated users
 * Preserves the attempted URL for post-login redirect
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserContext();
  const location = useLocation();
  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }
  // Redirect to login if not authenticated
  if (!user) {
    // Save the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // User is authenticated, then render the protected content
  return children;
};

export default ProtectedRoute;