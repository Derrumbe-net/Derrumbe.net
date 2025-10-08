import './LandslideReadyPR_module.css';
import logo from '../assets/LANDSLIDEREADY_LOGO.avif';
import ecoLogo from '../assets/ECOEXPLORATORIO_LOGO.svg';
import map from '../assets/municipality_map.webp';
import cycle from '../assets/landslideready_cycle.webp';
import groupPics from '../assets/landslideready_pictures.webp';
import coursePreview from '../assets/landslideready_module.webp';

function LandslideReadyPR() {
  return (
    <section className="landslideReady">

      <div className="landslideReady__header">
        <div className="landslideReady__text">
          <h1>LandslideReady en Puerto Rico</h1>
          <p>
            LandslideReady es una iniciativa que promueve la preparación y resiliencia frente a los deslizamientos de tierra a nivel individual y comunitario. 
            A través de módulos educativos gratuitos, las personas pueden aprender qué son los deslizamientos y cómo mitigarlos. Al mismo tiempo, el programa 
            colabora con municipios y oficinas de manejo de emergencias para fortalecer sus capacidades de prevención, respuesta y recuperación, creando comunidades más seguras y resilientes.
          </p>
        </div>
        <img src={logo} alt="LandslideReady logo" className="landslideReady__logo" />
      </div>

      <div className="landslideReady__municipios-section">
        <div className="landslideReady__municipios-left">
          <h2> LandslideReady para Municipios</h2>
          <p>
            LandslideReady es un programa de reconocimiento municipal organizado por la Oficina de Mitigación de Riesgos de Deslizamientos de Tierra de Puerto Rico.
          </p>
          <p>
            Trabajando con colaboradores de oficinas de emergencias municipales, nuestro objetivo es aumentar las actividades de preparación, mitigación y recuperación relacionadas con los peligros de deslizamientos de tierra.
          </p>

          <h3 className="landslideReady__subheader">
            Mapa de Municipios LandslideReady<br />
            <strong>(Actualizado en Marzo 4, 2025)</strong>
          </h3>
          <img src={map} alt="Mapa de municipios LandslideReady" className="landslideReady__map" />
          <p className="landslideReady__map-note">
            Si eres manejador de emergencia del municipio, estás interesado en el proyecto y quieres saber más, comunícate con nosotros.
          </p>

          <h3 className="landslideReady__subheader">Ciclo de LandslideReady</h3>
          <img src={cycle} alt="Ciclo LandslideReady" className="landslideReady__cycle" />
        </div>

        <div className="landslideReady__municipios-right">
          <img src={groupPics} alt="Talleres comunitarios" className="landslideReady__group-pics" />
        </div>
      </div>


      <h2 className="not-bold">LandslideReady para Individuos</h2>
      <div className="landslideReady__individuos-section">
        <div className="landslideReady__individuos-text">
          <p>
            El Ecoexploratorio Instituto de Resiliencia cuenta con unos módulos gratuitos con los cuales podrán aprender sobre deslizamientos de tierra. Estos módulos incluyen enseñanzas tales como qué son deslizamientos de tierra y cómo se pueden mitigar.
          </p>
          <p>
            Este módulo está bajo el nombre de LANDS101: LandslideReady/Deslizamientos de tierra en P.R. Estos módulos cuentan como 4 horas de contacto verde y el curso tiene una duración promedio de 5 horas en total.
          </p>
        </div>
        <div className="landslideReady__individuos-logo">
          <a href="https://ecoexploratorio.org/eri/cursos/" target="_blank" rel="noopener noreferrer">
            <img src={ecoLogo} alt="Ecoexploratorio Logo" />
          </a>
        </div>
      </div>

      <a
        className="landslideReady__button-outline"
        href="https://ecoexploratorio.org/eri/cursos/#1742922273665-a07cced4-5bd4"
        target="_blank"
        rel="noopener noreferrer"
      >
        Accede los Cursos
      </a>

      <h3 className="landslideReady__module-label">
        Una vez que accedas a los módulos, la página se verá de esta manera:
      </h3>
      <img src={coursePreview} alt="Vista previa del curso LandslideReady" className="landslideReady__module-image" />

    </section>
  );
}
export default LandslideReadyPR;