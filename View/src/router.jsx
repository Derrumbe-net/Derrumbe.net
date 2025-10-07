import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Guide from './pages/Guide';
import InteractiveMap from './pages/InteractiveMap';
import LandslideReadyPR from './pages/LandslideReadyPR';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import RainForecast from './pages/RainForecast';
import Report from './pages/Report';
import Request from './pages/Request'
import Stations from './pages/Stations';
import SusceptibilityMap from './pages/SusceptibilityMap';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sobre-nosotros', element: <About /> },
      { path: 'proyectos', element: <Projects /> },
      { path: 'publicaciones', element: <Publications /> },
      { path: 'mapa-interactivo', element: <InteractiveMap /> },
      { path: 'estaciones', element: <Stations /> },
      { path: 'pronostico-lluvia', element: <RainForecast /> },
      { path: 'guia-deslizamientos', element: <Guide /> },
      { path: 'mapa-susceptibilidad', element: <SusceptibilityMap /> },
      { path: 'reportar', element: <Report /> },
      { path: 'solicitud', element: <Request />},
      { path: 'landslideready-pr', element: <LandslideReadyPR /> },
    ],
  },
]);

export default router;