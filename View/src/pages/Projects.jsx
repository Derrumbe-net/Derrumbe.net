import { useState, useEffect } from "react";
import "./Projects_module.css";

import searchIcon from "../assets/search-icon-png-9.png";
import arrowToggle from "../assets/arrow-toggle-left-and-right-1.png";

import actualproject1 from "../assets/projects/proyecto actual 1.webp";
import actualproject2 from "../assets/projects/proyecto actual 2.webp";
import actualproject3 from "../assets/projects/proyecto actual 3.webp";
import actualproject4 from "../assets/projects/proyecto actual 4.webp";
import actualproject5 from "../assets/projects/proyecto actual 5.webp";

import pastproject1 from "../assets/projects/proyecto pasado 1.webp";
import pastproject2 from "../assets/projects/proyecto pasado 2.webp";
import pastproject3 from "../assets/projects/proyecto pasado 3.webp";
import pastproject4 from "../assets/projects/proyecto pasado 4.webp";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("present"); 

  // Hardcoded projects (temporary)
    useEffect(() => {
        // TODO: replace with backend fetch
        const hardcodedProjects = [
  {
    id: 1,
    title: "LandslideReady community engagement program in Puerto Rico",
    start_year: 2024,
    end_year: 2026,
    status: "present",
    description:
      "($473,895) Acuerdo de cooperación del USGS n.º G24AC00484: \"Programa de participación comunitaria LandslideReady en Puerto Rico 2024-2026.\" El propósito de este acuerdo es apoyar la investigación y la recopilación de datos relacionados con la implementación y el análisis de un programa de certificación municipal estructurado LandslideReady en Puerto Rico (PR). LandslideReady está modelado a partir de los exitosos esfuerzos StormReady y TsunamiReady del NWS. En los últimos años, la Oficina de Mitigación de Peligros de Deslizamientos de Tierra de PR (PRLHMO) ha codiseñado una versión piloto de LandslideReady con aportes de científicos físicos, científicos sociales, el gobierno federal/estatal/local, la industria privada, líderes comunitarios, grupos sin fines de lucro y otros socios ciudadanos. Las oficinas de gestión de emergencias municipales son los grupos objetivo que se certificarán como LandslideReady.",
    image: actualproject1,
  },
  {
    id: 2,
    title: "Evaluation of the Soil Mass Movement Risk Rating in Puerto Rico using the SLIDES-PR Hurricane María Slope Failure Inventory.",
    start_year: 2019,
    end_year: 2021,
    status: "past",
    description:
      "($50,098) Acuerdo de cooperación entre el USDA y el NRCS NR20F3520001C001: \"Evaluación de la calificación de riesgo de movimiento de masas de suelo en Puerto Rico utilizando el inventario de fallas de taludes del huracán María de SLIDES-PR\". Este proyecto condujo a una comprensión mucho mejor del papel de la composición y las características del suelo en los deslizamientos de tierra superficiales en Puerto Rico.",
    image: pastproject1,
  },
  {
    id: 3,
    title: "Climate Adaptation Partnerships: Caribbean Climate Adaptation Network: Building equitable adaptive capacities of the USVI and Puerto Rico",
    start_year: 2022,
    end_year: 2027,
    status: "present",
    description:
      "($462,505) NOAA Climate Program Office Award #NA22OAR4310545: \"Asociaciones de adaptación climática: Red de adaptación climática del Caribe: creación de capacidades de adaptación equitativas de las Islas Vírgenes de los Estados Unidos y Puerto Rico\". Este esfuerzo busca mejorar y expandir las asociaciones mediante el desarrollo y la convocatoria de partes interesadas en Puerto Rico y las Islas Vírgenes de los Estados Unidos. La red de conocimiento y acción propuesta está diseñada para ayudar a desarrollar capacidades de adaptación para futuros extremos climáticos, planificar respuestas a peligros climáticos en cascada y crisis de gobernanza. Colaboradores: UPR Ciencias Médicas, Universidad de las Islas Vírgenes, Universidad de Texas, Universidad de Nueva York, Instituto Politécnico de Worcester",
    image: actualproject2,
  },
   {
    id: 4,
    title: "Puerto Rico Landslide Hazard Reduction Project",
    start_year: 2023,
    end_year: 2025,
    status: "present",
    description:
      "($499,956) Acuerdo de cooperación del USGS n.° G23AC00479: \"Proyecto de reducción del riesgo de deslizamientos de tierra en Puerto Rico 2023-2025\". Esta adjudicación amplía un acuerdo vigente entre el Programa de riesgo de deslizamientos de tierra del USGS y la Universidad de Puerto Rico en Mayagüez para establecer y operar una red de monitoreo hidrológico del suelo casi en tiempo real. El nuevo acuerdo ayudará a expandir la red de monitoreo hidrológico actual (de 15 estaciones actuales a al menos 20 estaciones) y brindará un medio para mantener la red funcional, complementando así una nueva \"Oficina de mitigación del riesgo de deslizamientos de tierra en Puerto Rico\" en el campus de la UPRM. El objetivo del esfuerzo de investigación y recopilación de datos es desarrollar métricas de pronóstico de deslizamientos de tierra en todo el territorio de la isla para usarlas en un sistema operativo.",
    image: actualproject3,
  },
  {
    id: 5,
    title: "Landslide Hazard Science and Risk Communication in Puerto Rico",
    start_year: 2024,
    end_year: 2026,
    status: "present",
    description:
      "($149,998) Premio #2024-00188 del Fideicomiso de Ciencia, Tecnología e Investigación de Puerto Rico: \"Ciencia y comunicación de riesgos de deslizamientos de tierra en Puerto Rico\". Este proyecto apoyará el desarrollo e implementación de un sistema operativo y en tiempo real de pronóstico de deslizamientos de tierra en Puerto Rico.",
    image: actualproject4,
  },
  {
    id: 6,
    title: "Collaborative Research: Testing Critical Zone Controls on Mountain-Scale Relief in a Tropical Climate",
    start_year: 2022,
    end_year: 2025,
    status: "present",
    description:
      "($284,503) Premio NSF de Ciencias de la Tierra #2139895: \"Investigación colaborativa: prueba de controles de zonas críticas en relieve a escala montañosa en un clima tropical\". Este proyecto examina cómo las diferencias en los procesos de la zona crítica influyen en la topografía a través de un experimento comparativo de dos unidades de lecho rocoso diferentes en la isla tropical de Puerto Rico. Colaborador: Universidad Estatal de Colorado",
    image: actualproject5,
  },
  {
    id: 7,
    title: "Collaborative Research: Quantifying controls on weathering of volcanic arc rocks",
    start_year: 2020,
    end_year: 2022,
    status: "past",
    description:
      "($117,469) Premio NSF de Ciencias de la Tierra #2011358: \"Investigación colaborativa: cuantificación de los controles sobre la erosión de las rocas de arco volcánico\". El objetivo de este proyecto era medir cómo la erosión química de las rocas volcánicas e ígneas ricas en hierro depende del suministro de minerales frescos por erosión física. Esta relación es fundamental para comprender el papel de los procesos tectónicos en el control del ciclo global del carbono y el clima a través del tiempo geológico. Colaborador: Universidad de Purdue",
    image: pastproject2,
  },
  {
    id: 8,
    title: "Track I Center Catalyst: Collaborative Center for Landslides and Ground Failure Geohazards",
    start_year: 2022,
    end_year: 2024,
    status: "past",
    description:
      "($89,700) Premio NSF de Ciencias de la Tierra #2224973: \"Track I Center Catalyst: Collaborative Center for Landslides and Ground Failure Geohazards\". Este proyecto se centró en la investigación relacionada con las causas fundamentales y los mecanismos desencadenantes de los deslizamientos de tierra, así como en el desarrollo de una comprensión de los peligros que se generan a partir de los derrumbes del terreno. Este proyecto de Track I utilizó a Puerto Rico como un laboratorio viviente para estudiar los deslizamientos de tierra y su impacto en la comunidad. Colaboradores: Georgia Tech, Universidad de Colorado.",
    image: pastproject3,
  },
  {
    id: 9,
    title: "Collaborative Research: RAPID: The fate of landslide-derived sediment following tropical cyclones: a case study of Hurricane Fiona in Puerto Rico",
    start_year: 2022,
    end_year: 2023,
    status: "past",
    description:
      "($21,750) Premio NSF de Ciencias de la Tierra #2301379: \"Investigación colaborativa: RAPID: El destino de los sedimentos derivados de deslizamientos de tierra después de ciclones tropicales: un estudio de caso del huracán Fiona en Puerto Rico\". Este proyecto respaldó la recopilación de datos perecederos y sensibles al tiempo de las cuencas fluviales montañosas de Puerto Rico fuertemente afectadas por el vertido masivo después del huracán Fiona. Colaboradores: Georgia Tech",
    image: pastproject4,
  },
];
        setProjects(hardcodedProjects);
    }, []);


  const filteredProjects = projects.filter((p) => {
    const matchesStatus = p.status === filterStatus;
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  })

  return (
    <div className="projects-page">
      <h1 className="projects-title">Proyectos</h1>
      <p className="projects-intro">
        Explore los proyectos de investigación y cooperación desarrollados por la Oficina
        de Mitigación ante Deslizamientos de Tierra de Puerto Rico. Estas iniciativas, en
        colaboración con agencias federales, universidades y comunidades, abarcan desde el
        análisis de riesgos y procesos geológicos hasta programas de participación
        ciudadana y adaptación climática.
      </p>
      <p className="projects-subintro">
        Su propósito es generar conocimiento científico, fortalecer la mitigación de
        deslizamientos y apoyar la resiliencia de Puerto Rico ante eventos extremos.
      </p>

      <div className="projects-controls">
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>

        {/* Filter Button */}
        <button
          className="filter-btn"
          onClick={() =>
            setFilterStatus(filterStatus === "present" ? "past" : "present")
          }
        >
          {filterStatus === "present"
            ? "Proyectos Actuales"
            : "Proyectos Pasados"}
          <img src={arrowToggle} alt="Toggle Projects" className="filter-icon" />
        </button>
      </div>

      <div className="projects-container">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <img
              src={project.image}
              alt={project.title}
              className="project-image"
            />
            <h2 className="project-title">{project.title}</h2>
            <h3 className="project-years">
              {project.start_year}–{project.end_year}
            </h3>
            <p className="project-description">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
