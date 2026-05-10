import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/apiHooks';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserByToken } = useUser();
  const navigate = useNavigate();

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      const userData = await getUserByToken(token);
      console.log('User data loaded:', userData);
      setUser(userData);
      
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Handle auth errors
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      // Handle 400 errors
      if (err.message?.includes('400')) {
        console.warn('Bad request - token may be malformed');
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, [getUserByToken, navigate]);

  if (loading) return <div className="loading"> Loading profile...</div>;
  if (error) return <div className="error"> {error}</div>;
  if (!user) return <div className="error"> Not authenticated</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <div className="profile-field">
          <strong>Username:</strong> {user.username}
        </div>
        <div className="profile-field">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="profile-field">
          <strong>User ID:</strong> {user.id || user.user_id}
        </div>
        <div className="profile-field">
          <strong>Created:</strong>{' '}
          {user.created_at ? new Date(user.created_at).toLocaleString('fi-FI') : 'N/A'}
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/logout')}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;