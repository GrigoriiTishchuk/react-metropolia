import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import Home from './views/Home';
import Profile from './views/Profile';
import Upload from './views/Upload';
import Single from './views/Single';
import Login from './views/Login';  
import Logout from './views/Logout';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
      <Routes>
        {/*Layout wraps all child routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          <Route path="/upload" element={<Upload />} />
          <Route path="/single" element={<Single />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          {/*404 fallback route */}
          <Route path="*" element={<h2>Page not found</h2>} />
        </Route>
      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};
export default App;