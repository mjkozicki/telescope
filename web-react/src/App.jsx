import { Routes, Route, useLocation } from 'react-router-dom';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Tabs from './components/Tabs';
import Home from './pages/Home';
import Advanced from './pages/Advanced';
import Results from './pages/Results';
import Upload from './pages/Upload';
import ResultOverview from './pages/result/Overview';
import ResultMetrics from './pages/result/Metrics';
import ResultResources from './pages/result/Resources';
import ResultWaterfall from './pages/result/Waterfall';
import ResultFilmstrip from './pages/result/Filmstrip';
import ResultVideo from './pages/result/Video';
import ResultConsole from './pages/result/Console';
import ResultBottlenecks from './pages/result/Bottlenecks';
import ResultConfig from './pages/result/Config';

function App() {
  const location = useLocation();
  const isResultPage = location.pathname.includes('/results/') && 
                       location.pathname.split('/').length > 3;

  return (
    <div className="app">
      <Logo />
      <Navigation />
      <header>
        <Tabs />
      </header>
      <main>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/advanced" element={<Advanced />} />
            <Route path="/results" element={<Results />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:testId/overview" element={<ResultOverview />} />
            <Route path="/results/:testId/metrics" element={<ResultMetrics />} />
            <Route path="/results/:testId/resources" element={<ResultResources />} />
            <Route path="/results/:testId/waterfall" element={<ResultWaterfall />} />
            <Route path="/results/:testId/filmstrip" element={<ResultFilmstrip />} />
            <Route path="/results/:testId/video" element={<ResultVideo />} />
            <Route path="/results/:testId/console" element={<ResultConsole />} />
            <Route path="/results/:testId/bottlenecks" element={<ResultBottlenecks />} />
            <Route path="/results/:testId/config" element={<ResultConfig />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

