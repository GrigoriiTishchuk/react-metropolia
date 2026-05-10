import { useEffect } from 'react';
import { useUserContext } from '../hooks/contextHooks';

const Logout = () => {
  const { handleLogout } = useUserContext();
  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return (
    <div className="auth-container">
      <p>Logged out...</p>
    </div>
  );
};

export default Logout;