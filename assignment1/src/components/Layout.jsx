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
        <nav className="bg-gray-800 px-4 py-3">
        <ul className="flex gap-6 list-none m-0 p-0">
          <li>
            <Link 
              to="/" 
              className="text-white font-medium px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Home
            </Link>
          </li>
          
          {user ? (
            <>
              <li>
                <Link 
                  to="/profile" 
                  className="text-white font-medium px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  {user.username}
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className="text-white font-medium px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Upload
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogoutClick}
                  className="text-red-400 font-medium px-3 py-2 rounded hover:bg-gray-700 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link 
                to="/login" 
                className="text-white font-medium px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Login
              </Link>
            </li>
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