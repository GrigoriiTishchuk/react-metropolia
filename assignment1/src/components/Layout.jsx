// src/components/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/contextHooks';

const Layout = () => {
  const { user, handleLogout, loading } = useUserContext();
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    handleLogout(); //Call context logout function
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <nav>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Home</Link></li>
            
            {/* Conditional rendering based on auth state */}
            {user ? (
              <>
                <li><Link to="/profile" className="nav-link">{user.username}</Link></li>
                <li><Link to="/upload" className="nav-link">Upload</Link></li>
                <li>
                  <button onClick={handleLogoutClick} className="nav-link logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login" className="nav-link">Login</Link></li>
            )}
          </ul>
        </nav>
        {loading && <div className="auth-loading">Loading...</div>}
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <small>© 2026 Media App</small>
      </footer>
    </div>
  );
};

export default Layout;