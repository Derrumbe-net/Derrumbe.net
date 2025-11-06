import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Guide from './pages/Guide';
import InteractiveMap from './pages/InteractiveMap';
import LandslideReadyPR_Individuos from './pages/LandslideReadyPR_Individuos';
import LandslideReadyPR_Municipios from './pages/LandslideReadyPR_Municipios';
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
      { path: 'landslideready-individuos', element: <LandslideReadyPR_Individuos /> },
      { path: 'landslideready-municipios', element: <LandslideReadyPR_Municipios /> },
    ],
  },
]);

export default router;