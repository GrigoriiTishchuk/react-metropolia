// src/views/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="auth-container">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;