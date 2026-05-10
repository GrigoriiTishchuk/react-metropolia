import { useUserContext } from '../hooks/contextHooks';

const Profile = () => {
  // Get user directly from context 
  const { user, loading } = useUserContext();
  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }
  if (!user) {
    return <div className="error">Not authenticated</div>;
  }
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
          <strong>User ID:</strong> {user.user_id}
        </div>
        <div className="profile-field">
          <strong>Role:</strong> {user.level_name}
        </div>
        <div className="profile-field">
          <strong>Created:</strong>{' '}
          {user.created_at ? new Date(user.created_at).toLocaleString('fi-FI') : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Profile;