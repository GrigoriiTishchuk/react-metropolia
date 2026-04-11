import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './views/Home';
import Profile from './views/Profile';
import Upload from './views/Upload';
import Single from './views/Single';
const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/*Layout wraps all child routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/single" element={<Single />} />
          {/*404 fallback route */}
          <Route path="*" element={<h2>Page not found</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;