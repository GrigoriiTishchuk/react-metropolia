import { useState } from 'react';
import PropTypes from 'prop-types';
import useForm from '../hooks/formHooks';
import { useUserContext } from '../hooks/contextHooks'; 

const LoginForm = ({ onSwitch }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Get login function from context
  const { handleLogin } = useUserContext();
  const initValues = { username: '', password: '' };

  const doLogin = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      //Call context's handleLogin
      await handleLogin(formData);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doLogin, initValues);

  return (
    <div className="auth-form">
      <h2>Login</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            name="username"
            type="text"
            value={inputs.username}
            onChange={handleInputChange}
            autoComplete="username"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={inputs.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading || !inputs.username || !inputs.password}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="switch-form">
        No account?{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          Register here
        </button>
      </p>
    </div>
  );
};

LoginForm.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default LoginForm;