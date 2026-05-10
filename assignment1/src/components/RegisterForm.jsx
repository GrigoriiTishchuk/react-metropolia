// src/components/RegisterForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import useForm from '../hooks/formHooks';
import { useUser } from '../hooks/apiHooks';

const RegisterForm = ({ onSwitch, onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Get user creation function from custom hook
  const { postUser } = useUser();
  const initValues = {
    username: '',
    email: '',
    password: '',
  };

  const doRegister = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      // Validate passwords match 
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      // Call API via custom hook
      const result = await postUser(formData);
      // Auto-login after successful registration 
      if (result?.message?.includes('created')) {
        // Could auto-login here, or just show success
        onSuccess?.({ message: 'Registration successful! Please login.' });
      }
      
    } catch (err) {
      console.error('Registration failed:', err);
      // API may return error details in response body
      setError(err.message || 'Registration failed. Username may be taken.');
    } finally {
      setLoading(false);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doRegister, initValues);

  return (
    <div className="auth-form">
      <h2>Register</h2>
      
      {error && <div className="error-message">❌ {error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            name="username"
            type="text"
            value={inputs.username}
            onChange={handleInputChange}
            autoComplete="username"
            required
            disabled={loading}
            minLength={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            name="email"
            type="email"
            value={inputs.email}
            onChange={handleInputChange}
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            name="password"
            type="password"
            value={inputs.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            required
            disabled={loading}
            minLength={6}
          />
        </div>
        
        <button type="submit" disabled={loading || !inputs.username || !inputs.email || !inputs.password}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="switch-form">
        Already have an account?{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          Login here
        </button>
      </p>
    </div>
  );
};

RegisterForm.propTypes = {
  onSwitch: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default RegisterForm;