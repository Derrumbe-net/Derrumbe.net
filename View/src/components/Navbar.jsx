import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/PRLHMO_LOGO.svg';

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="nav">
      <div className="nav__inner">
        {/* Logo → Landing */}
        <Link to="/" className="nav__brand" aria-label="Ir al inicio">
          <img
            src={logo}
            alt="PR Landslide Hazard Mitigation Office"
            className="nav__logo"
          />
        </Link>

        <ul className="nav__list">

          <li className="nav__item">
            <Link to="/" className="nav__link">Inicio</Link>
          </li>

          <li className="nav__item">
            <Link to="/sobre-nosotros" className="nav__link">Sobre Nosotros</Link>
          </li>

          {/* Contribuciones */}
          <li className="nav__item nav__item--dropdown">
            <button
              className="nav__link nav__toggle"
              aria-haspopup="true"
              aria-expanded={openDropdown === "contribuciones"}
              onClick={() => toggleDropdown("contribuciones")}
            >
              Contribuciones {openDropdown === "contribuciones" ? "▴" : "▾"}
            </button>
            {openDropdown === "contribuciones" && (
              <ul className="nav__menu">
                <li><Link to="/proyectos" className="nav__sublink">Proyectos</Link></li>
                <li><Link to="/publicaciones" className="nav__sublink">Publicaciones</Link></li>
              </ul>
            )}
          </li>

          {/* Monitoreo */}
          <li className="nav__item nav__item--dropdown">
            <button
              className="nav__link nav__toggle"
              aria-haspopup="true"
              aria-expanded={openDropdown === "monitoreo"}
              onClick={() => toggleDropdown("monitoreo")}
            >
              Monitoreo {openDropdown === "monitoreo" ? "▴" : "▾"}
            </button>
            {openDropdown === "monitoreo" && (
              <ul className="nav__menu">
                <li><Link to="/mapa-interactivo" className="nav__sublink">Mapa Interactivo</Link></li>
                <li><Link to="/estaciones" className="nav__sublink">Estaciones</Link></li>
                <li><Link to="/pronostico-lluvia" className="nav__sublink">Pronóstico de lluvia</Link></li>
              </ul>
            )}
          </li>

          {/* Recursos */}
          <li className="nav__item nav__item--dropdown">
            <button
              className="nav__link nav__toggle"
              aria-haspopup="true"
              aria-expanded={openDropdown === "recursos"}
              onClick={() => toggleDropdown("recursos")}
            >
              Recursos {openDropdown === "recursos" ? "▴" : "▾"}
            </button>
            {openDropdown === "recursos" && (
              <ul className="nav__menu">
                <li><Link to="/guia-deslizamientos" className="nav__sublink">Guía sobre Deslizamientos</Link></li>
                <li><Link to="/mapa-susceptibilidad" className="nav__sublink">Mapa de Susceptibilidad</Link></li>
              </ul>
            )}
          </li>

          <li className="nav__item"><Link to="/reportar" className="nav__link">Reportar</Link></li>
          <li className="nav__item"><Link to="/landslideready-pr" className="nav__link">LandslideReady</Link></li>
        </ul>
      </div>

      {/* Dropdowns render BELOW navbar */}
      {openDropdown && <div className="nav__dropdown-background"></div>}
    </nav>
  );
}

export default Navbar;
