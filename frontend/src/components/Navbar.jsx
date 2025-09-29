import { Link } from 'react-router-dom';
import logo from '../assets/prlhmo_logo.png';

function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        {/* Logo → Landing */}
        <Link to="/" className="nav__brand" aria-label="Ir al inicio">
          <img src={logo} alt="PR Landslide Hazard Mitigation Office" className="nav__logo" />
        </Link>

        <ul className="nav__list">
          <li className="nav__item">
            <Link to="/sobre-nosotros" className="nav__link">Sobre Nosotros</Link>
          </li>

          <li className="nav__item nav__item--dropdown">
            <button className="nav__link nav__toggle" aria-haspopup="true" aria-expanded="false">
              Contribuciones ▾
            </button>
            <ul className="nav__menu">
              <li><Link to="/proyectos" className="nav__sublink">Proyectos</Link></li>
              <li><Link to="/publicaciones" className="nav__sublink">Publicaciones</Link></li>
            </ul>
          </li>

          <li className="nav__item nav__item--dropdown">
            <button className="nav__link nav__toggle" aria-haspopup="true" aria-expanded="false">
              Monitoreo ▾
            </button>
            <ul className="nav__menu">
              <li><Link to="/mapa-interactivo" className="nav__sublink">Mapa Interactivo</Link></li>
              <li><Link to="/estaciones" className="nav__sublink">Estaciones</Link></li>
              <li><Link to="/pronostico-lluvia" className="nav__sublink">Pronóstico de lluvia</Link></li>
            </ul>
          </li>

          <li className="nav__item nav__item--dropdown">
            <button className="nav__link nav__toggle" aria-haspopup="true" aria-expanded="false">
              Recursos ▾
            </button>
            <ul className="nav__menu">
              <li><Link to="/guia-deslizamientos" className="nav__sublink">Guía sobre Deslizamientos</Link></li>
              <li><Link to="/mapa-susceptibilidad" className="nav__sublink">Mapa de Susceptibilidad</Link></li>
            </ul>
          </li>

          <li className="nav__item"><Link to="/reportar" className="nav__link">Reportar</Link></li>
          <li className="nav__item"><Link to="/landslideready-pr" className="nav__link">LandslideReady PR</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;