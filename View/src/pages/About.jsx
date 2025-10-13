import "./About_module.css";
import officeMonitors from "../assets/office_monitors.webp";
import logo from "../assets/PRLHMO_LOGO.svg";
import coordinatorImage from "../assets/coordinator_professor.webp";
import assistantResearcher1 from "../assets/assistant_researcher_1.webp";
import assistantResearcher2 from "../assets/assistant_researcher_2.webp";
import linkedinLogo from "../assets/LINKEDIN_LOGO.svg";


function About() {
  return (
    <section className="about">
      <div className="about__content">
        <div className="about__image-wrapper">
          <img
            src={officeMonitors}
            alt="Monitores de la oficina"
            className="about__image"
            loading="lazy"
          />
        </div>
        <div className="about__text-block">
          <img src={logo} alt="Logo PRLHMO" className="about__logo-bg" />
          <h1 className="about__title">¿Quiénes somos?</h1>
          <p className="about__description">
            La Oficina de Mitigación de Peligros de Deslizamientos de Tierra en Puerto Rico
            es parte del Departamento de Geología de la Universidad de Puerto Rico en Mayagüez.
            La oficina trabaja con diversas agencias, partes interesadas, organizaciones comunitarias
            y otros en los asuntos relacionados con los peligros de deslizamientos de tierra en Puerto Rico.
          </p>
          <p className="about__mission" ><strong>Misión:</strong> Llevar a cabo investigaciones continuas y actividades de participación comunitaria relacionadas con los peligros de deslizamientos de tierra en Puerto Rico.</p>
          <p className="about__vision"><strong>Visión:</strong> Ciencia y preparación para los peligros de deslizamientos de tierra en Puerto Rico.</p>
        </div>
      </div>

      <div className="directory__title">Directorio de Oficina</div> 
      <h2 className="directory__subtitle">Facultad</h2>

      <div className="directory__profiles">

        <div className="directory__card">
          <img src={coordinatorImage} alt="Stephen Hughes" className="profile" />
          <div className="directory__info">
            <div className="directory__linkedin">
              <div className="directory__linkedin-box">
                <a href="https://www.linkedin.com/in/stephen-hughes-1a35a091/" target="_blank" rel="noreferrer">
                  <img src={linkedinLogo} alt="LinkedIn" className="footer__icon" />
                </a>
              </div>
            </div> 
            <div className="directory__person-info" > 
              <strong>Sthephen Hughes</strong>
              <p>Coordinator and PI</p>
              <p>
                kenneth.hughes@upr.edu <br />
                (787) 832-4040 <br />
                Ext. 6844, 2706
              </p>
            </div>
          </div>
        </div>

        <div className="directory__card">
          <img src={assistantResearcher1} alt="Pedro Matos" className="profile" />
          <div className="directory__info">
            <div className="directory__linkedin">
              <div className="directory__linkedin-box">
                <a href="https://www.linkedin.com/in/matosllavonap" target="_blank" rel="noreferrer">
                  <img src={linkedinLogo} alt="LinkedIn" className="footer__icon" />
                </a>
              </div>
            </div>
            <div className="directory__person-info" >
              <strong>Pedro Matos</strong>
              <p>Assistant Researcher</p>
              <p>
                pedro.matos4@upr.edu <br />
                (787) 832-4040 <br />
                Ext. 6843
              </p>
            </div>
            
          </div>
        </div>

        <div className="directory__card">
          <img src={assistantResearcher2} alt="Isabella Cámara" className="profile" />
          <div className="directory__info">
            <div className="directory__linkedin">
              <div className="directory__linkedin-box">
                <a href="https://www.linkedin.com/in/isabella-camara-torres-" target="_blank" rel="noreferrer">
                  <img src={linkedinLogo} alt="LinkedIn" className="footer__icon" />
                </a>
              </div>
            </div>
            <div className="directory__person-info" >
              <strong>Isabella Cámara</strong>
              <p>Assistant Researcher</p>
              <p>
                isabella.camara@upr.edu <br />
                (787) 832-4040 <br />
                Ext. 6843
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="directory__groups">
        <div className="directory__group">
          <h3>Estudiantes Graduados</h3>
          <ul>
            <li>Anishka Ruiz</li>
            <li>César Rodríguez</li>
            <li>Tanía Figueroa</li>
            <li>Estefanía Vicens</li>
            <li>Eduardo González</li>
            <li>Karla Torres</li>
          </ul>
        </div>
        <div className="directory__group">
          <h3>Estudiantes Subgraduados</h3>
          <ul>
            <li>Gabriel A. Colón</li>
            <li>Ednet C. López</li>
            <li>Mía V. Aponte</li>
            <li>Anthony Y. Collazo</li>
            <li>Kyleshaquill Fred</li>
          </ul>
        </div>
      </div>

    </section>
  );
}

export default About;
