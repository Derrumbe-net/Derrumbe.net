import { useState, useEffect } from "react";
import "../styles/Projects_module.css";

import searchIcon from "../assets/search-icon-png-9.png";
import arrowToggle from "../assets/arrow-toggle-left-and-right-1.png";

// 🖼️ Local images
import actualproject1 from "../assets/projects/proyecto actual 1.webp";
import actualproject2 from "../assets/projects/proyecto actual 2.webp";
import actualproject3 from "../assets/projects/proyecto actual 3.webp";
import actualproject4 from "../assets/projects/proyecto actual 4.webp";
import actualproject5 from "../assets/projects/proyecto actual 5.webp";

import pastproject1 from "../assets/projects/proyecto pasado 1.webp";
import pastproject2 from "../assets/projects/proyecto pasado 2.webp";
import pastproject3 from "../assets/projects/proyecto pasado 3.webp";
import pastproject4 from "../assets/projects/proyecto pasado 4.webp";

// 🧩 Map backend project_id to local images
const imageMap = {
  1: pastproject1, // Evaluation of the Soil Mass Movement Risk Rating
  2: pastproject2, // Quantifying controls on weathering
  3: pastproject3, // Track I Center Catalyst
  4: pastproject4, // RAPID Hurricane Fiona
  6: actualproject1, // LandslideReady program
  7: actualproject2, // Climate Adaptation Partnerships
  8: actualproject3, // Landslide Hazard Reduction Project
  10: actualproject4, // Hazard Science and Risk Communication
  12: actualproject5, // Critical Zone Controls
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/projects");
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const data = await response.json();

        // Normalize backend data + attach local images
        const formattedData = data.map((item) => ({
          id: item.project_id,
          title: item.title,
          start_year: item.start_year,
          end_year: item.end_year,
          status:
            item.project_status === "active"
              ? "present"
              : "past",
          description: item.description,
          image: imageMap[item.project_id] || "/placeholder.webp",
        }));

        setProjects(formattedData);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ? true : p.status === filterStatus;
    return matchesStatus && matchesSearch;
  });

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

        {/* Filter Dropdown */}
        <div className="filter-container">
          <select
            className="filter-dropdown"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los Proyectos</option>
            <option value="present">Proyectos Actuales</option>
            <option value="past">Proyectos Pasados</option>
          </select>
        </div>
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
