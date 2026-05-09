import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li>
              <Link to="/upload" className="nav-link">Upload</Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <main className="app-main">
        {/*Child routes render here */}
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <small>© 2026 Media App</small>
      </footer>
    </div>
  );
};

export default Layout;