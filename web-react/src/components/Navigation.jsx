import { Link, useLocation, useParams } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const params = useParams();
  const isResultPage = location.pathname.includes('/results/') && 
                       location.pathname.split('/').length > 3;
  const testId = isResultPage ? location.pathname.split('/')[2] : null;

  const isActive = (path) => {
    if (!testId) return false;
    return location.pathname === `/results/${testId}/${path}`;
  };

  return (
    <nav className="common-nav">
      {isResultPage ? (
        <>
          <Link 
            to={`/results/${testId}/overview`}
            className={`nav-link ${isActive('overview') ? 'active' : ''}`}
          >
            Overview
          </Link>
          <Link 
            to={`/results/${testId}/metrics`}
            className={`nav-link ${isActive('metrics') ? 'active' : ''}`}
          >
            Metrics
          </Link>
          <Link 
            to={`/results/${testId}/resources`}
            className={`nav-link ${isActive('resources') ? 'active' : ''}`}
          >
            Resources
          </Link>
          <Link 
            to={`/results/${testId}/waterfall`}
            className={`nav-link ${isActive('waterfall') ? 'active' : ''}`}
          >
            Waterfall
          </Link>
          <Link 
            to={`/results/${testId}/filmstrip`}
            className={`nav-link ${isActive('filmstrip') ? 'active' : ''}`}
          >
            Filmstrip
          </Link>
          <Link 
            to={`/results/${testId}/video`}
            className={`nav-link ${isActive('video') ? 'active' : ''}`}
          >
            Video
          </Link>
          <Link 
            to={`/results/${testId}/console`}
            className={`nav-link ${isActive('console') ? 'active' : ''}`}
          >
            Console
          </Link>
          <Link 
            to={`/results/${testId}/bottlenecks`}
            className={`nav-link ${isActive('bottlenecks') ? 'active' : ''}`}
          >
            Bottlenecks
          </Link>
          <Link 
            to={`/results/${testId}/config`}
            className={`nav-link ${isActive('config') ? 'active' : ''}`}
          >
            Config
          </Link>
        </>
      ) : (
        <>
          <span className="nav-link disabled">Overview</span>
          <span className="nav-link disabled">Metrics</span>
          <span className="nav-link disabled">Resources</span>
          <span className="nav-link disabled">Waterfall</span>
          <span className="nav-link disabled">Filmstrip</span>
          <span className="nav-link disabled">Video</span>
          <span className="nav-link disabled">Console</span>
          <span className="nav-link disabled">Bottlenecks</span>
          <span className="nav-link disabled">Config</span>
        </>
      )}
    </nav>
  );
}

export default Navigation;

