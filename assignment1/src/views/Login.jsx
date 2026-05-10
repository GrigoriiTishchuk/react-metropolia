// src/views/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  // Called when login/register succeeds
  const handleSuccess = (result) => {
    // show notification
    if (result?.message) {
      alert(result.message);
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-container">
      {showRegister ? (
        <RegisterForm 
          onSwitch={() => setShowRegister(false)} 
          onSuccess={handleSuccess}
        />
      ) : (
        <LoginForm 
          onSwitch={() => setShowRegister(true)} 
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Login;