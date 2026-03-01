import { useContext, useEffect } from 'react';
import { SecurityContext } from '../context/SecurityContext';
import { Navigate, useLocation } from 'react-router-dom';

const SecurityRouteGuard = ({ children }) => {
  const { isAuthenticated, token, logout, securityInfo } = useContext(SecurityContext);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        logout();
        return;
      }

      // Check token expiration
      const timestamp = localStorage.getItem("security_token_timestamp");
      if (timestamp) {
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 8 * 60 * 60 * 1000; // 8 hours
        
        if (tokenAge > maxAge) {
          logout("Session expired");
          return;
        }
      }

      // Check if security info exists
      if (!securityInfo) {
        const savedInfo = localStorage.getItem("security_info");
        if (!savedInfo) {
          logout("Session information missing");
          return;
        }
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Redirect if not authenticated
  if (!isAuthenticated && location.pathname !== '/security-login') {
    return <Navigate to="/security-login" state={{ from: location }} replace />;
  }

  // Redirect if authenticated and trying to access login
  if (isAuthenticated && location.pathname === '/security-login') {
    return <Navigate to="/security-dashboard" replace />;
  }

  return children;
};

export default SecurityRouteGuard;