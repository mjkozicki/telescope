import { Link, useLocation } from 'react-router-dom';

function Tabs() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="tabs">
      <Link to="/" className={`tab ${isActive('/') ? 'active' : ''}`}>
        Simple
      </Link>
      <Link to="/advanced" className={`tab ${isActive('/advanced') ? 'active' : ''}`}>
        Advanced
      </Link>
      <Link to="/results" className={`tab ${isActive('/results') ? 'active' : ''}`}>
        Results
      </Link>
      <Link to="/upload" className={`tab ${isActive('/upload') ? 'active' : ''}`}>
        Upload
      </Link>
    </div>
  );
}

export default Tabs;

