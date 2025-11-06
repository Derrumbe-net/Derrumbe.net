import { useState, useEffect } from "react";
import "../styles/Publications_module.css";

import searchIcon from "../assets/search-icon-png-9.png";

// 🖼️ Local images
import publication1 from "../assets/publications/publication1.webp";
import pub1 from "../assets/publications/pub1.webp";
import pub2 from "../assets/publications/pub2.webp";
import pub3 from "../assets/publications/pub3.webp";
import pub4 from "../assets/publications/pub4.webp";
import pub5 from "../assets/publications/pub5.webp";
import pub6 from "../assets/publications/pub6.webp";
import pub7 from "../assets/publications/pub7.webp";
import pub8 from "../assets/publications/pub8.webp";
import pub9 from "../assets/publications/pub9.webp";
import pub10 from "../assets/publications/pub10.webp";
import pub11 from "../assets/publications/pub11.webp";
import pub12 from "../assets/publications/pub12.webp";
import pub13 from "../assets/publications/pub13.webp";
import pub14 from "../assets/publications/pub14.webp";
import pub15 from "../assets/publications/pub15.webp";
import pub16 from "../assets/publications/pub16.webp";
import pub17 from "../assets/publications/pub17.webp";
import pub18 from "../assets/publications/pub18.webp";
import pub19 from "../assets/publications/pub19.webp";

// 🧩 Map backend publication_id to local images
const imageMap = {
  3: pub1, // Tracking a limestone bedrock landslide
  4: pub2, // Chemical Weathering and Physical Erosion Fluxes
  5: pub3, // Dynamic Landslide Susceptibility
  6: pub4, // Neotectonic Mapping of Puerto Rico
  7: pub5, // Volcanic arc weathering rates
  8: pub6, // Pseudo-Three-Dimensional Back-Analysis
  9: pub7, // Assessing Social Vulnerability
  10: pub8, // Climato-tectonic evolution
  11: pub9, // Geotechnical Impacts of Hurricane Fiona
  12: pub10, // Principles for collaborative risk communication
  13: pub11, // WIDESPREAD SHALLOW MASS WASTING
  14: pub12, // Geotechnical Reconnaissance Jan 7, 2020 Earthquake
  15: pub13, // Landslide Science in Puerto Rico
  16: pub14, // Map depicting susceptibility
  17: pub15, // Landslides triggered by Hurricane Maria
  18: pub16, // Map of slope-failure locations
  19: pub17, // Multi-Decadal Earth Dam Deformation Monitoring
  20: pub18, // Geotechnical Impacts of Hurricane Maria (GEER)
  21: pub19, // Comprehensive Hurricane María Mass Wasting Inventory
};

function Publications() {
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🧠 Fetch from backend
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/publications");
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const data = await response.json();

        const formattedData = data.map((item) => ({
          id: item.publication_id,
          title: item.title || "Publicación sin título",
          description: item.description || "",
          // override URL for publication 3 to open the poster image, TODO: THIS NEEDS TO CHANGE
          url:
            item.publication_id === 3
              ? publication1
              : item.publication_url || "#",
          image: imageMap[item.publication_id] || publication1, // fallback
        }));

        setPublications(formattedData);
      } catch (err) {
        console.error("Error fetching publications:", err);
      }
    };

    fetchPublications();
  }, []);

  const filteredPublications = publications.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-page">
      <h1 className="projects-title">Publicaciones</h1>
      <p className="projects-intro">
        Explore nuestra colección de publicaciones, resultado del trabajo académico y
        técnico de la oficina, enfocadas en la investigación y el entendimiento de los
        deslizamientos en Puerto Rico.
      </p>

      <div className="projects-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>
      </div>

      <div className="publications-container">
        {filteredPublications.map((pub) => (
          <div key={pub.id} className="publication-card">
            <img src={pub.image} alt={pub.title} className="publication-image" />
            <h3 className="publication-title">{pub.title}</h3>
            <p className="publication-description">{pub.description}</p>
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="publication-button"
            >
              Leer más →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Publications;
