import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication, useUser } from '../hooks/apiHooks';

const UserContext = createContext(null);
/**
 * Provider component that wraps the app and provides auth state/functions
 */
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track initial auth check
  const { postLogin } = useAuthentication();
  const { getUserByToken } = useUser();
  const navigate = useNavigate();

  // Login handler: called from LoginForm
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const result = await postLogin(credentials);
      if (result?.token) {
        localStorage.setItem('token', result.token.trim());
      }
      if (result?.user) {
        setUser(result.user);
      }
      navigate('/', { replace: true });
      
      return { success: true };
      
    } catch (err) {
      console.error('Login failed:', err);
      throw new Error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  // Logout handler: called from Logout component or nav
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };
  // Auto-login: checks for valid token on app load
  const handleAutoLogin = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return; // No token → not logged in
      }
      // Validate token with API
      const userData = await getUserByToken(token);
      setUser(userData);
      
    } catch (err) {
      console.warn('Auto-login failed (token invalid/expired):', err);
      // Clear invalid token
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false); // Always finish loading state
    }
  };

  // Run auto-login once on mount
  useEffect(() => {
    handleAutoLogin();
  }, []); // Empty deps = run once

  const contextValue = {
    user,
    loading,
    handleLogin,
    handleLogout,
    handleAutoLogin,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };