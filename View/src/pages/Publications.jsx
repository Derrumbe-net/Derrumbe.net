import { useState, useEffect } from "react";
import "../styles/Publications_module.css";

import searchIcon from "../assets/search-icon-png-9.png";
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

function Publications() {
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Hardcoded publications (temporary)
    useEffect(() => {
        // TODO: replace with backend fetch
        const hardcodedPublications =  [
    {
      id: 1,
      title:
        "Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico",
      description:
        "Rodríguez-Feliciano, César A.; Hughes, K. Stephen; Vélez-Santiago, Freddie; Department of Geology, University of Puerto Rico, Mayagüez, PR; Guánica, PR. (2025). Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico.",
      image: pub1,
      url: publication1, // This needs to be optimized (probably will be once we do the fetch)
    },
    {
      id: 2,
      title:
        "Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico",
      description:
        "Angus K. Moore, Kimberly Méndez Méndez, K. Stephen Hughes, Darryl E. Granger. (2025). Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico,https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776",
      image: pub2,
      url: "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776",
    },
    {
      id: 3,
      title:
        "Neotectonic Mapping of Puerto Rico",
      description:
        "Mejia-Manrique, S.A., Ramos-Scharrón, C.E., Hughes, K.S., Gonzalez-Cruz, J.E., and Khanbilvardi, R.M., 2025, Dynamic Landslide Susceptibility for Extreme Rainfall Events Using an Optimized Convolutional Neural Network Approach, https://link.springer.com/content/pdf/10.1007/s11069-025-07396-9.pdf",
      image: pub3,
      url: "https://link.springer.com/content/pdf/10.1007/s11069-025-07396-9.pdf",
    },
    {
      id: 4,
      title:
        "Dynamic Landslide Susceptibility for Extreme Rainfall Events Using an Optimized Convolutional Neural Network Approach",
      description:
        "Jessica A. Thompson Jobe, Richard Briggs, K. Stephen Hughes, James Joyce, Ryan Gold, Shannon Mahan, Harrison Gray, Laura Strickland, U.S. Geological Survey, Geologic Hazard Science Center, Golden, CO, USA, Department of Geology, University of Puerto Rico Mayagüez, Mayagüez, Puerto Rico, USA, U.S. Geological Survey, Geoscience and Environmental Change Science Center, Denver, CO, USA. (2024). Neotectonic Mapping of Puerto Rico, https://seismica.library.mcgill.ca/article/view/1102",
      image: pub4,
      url: "https://seismica.library.mcgill.ca/article/view/1102", 
    },
    {
      id: 5,
      title:
        "Volcanic arc weathering rates in the humid tropics controlled by the interplay between physical erosion and precipitation",
      description:
        "Moore, A. K., Méndez Méndez, K., Hughes, K. S., & Granger, D. E. (2024). Volcanic arc weathering rates in the humid tropics controlled by the interplay between physical erosion and precipitation. AGU Advances, 5, e2023AV001066. https://doi. org/10.1029/2023AV001066",
      image: pub5,
      url: "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2023AV001066", //
    },
    {
      id: 6,
      title:
        "Pseudo-Three-Dimensional Back-Analysis Of Rainfall-Induced Landslides In Utuado, Puerto Rico",
      description:
        "Mirna Kassem; Weibing Gong; Dimitrios Zekkos; Marin Clark; et. al;  Missouri University of Science and Technology. (2024). Pseudo-Three-Dimensional Back-Analysis Of Rainfall-Induced Landslides In Utuado, Puerto Rico, https://mst.elsevierpure.com/ws/portalfiles/portal/41586365/Pseudo-Three-Dimensional%20Back-Analysis%20Of%20Rainfall-Induced%20Landsl.pdf",
      image: pub6,
      url: "https://mst.elsevierpure.com/ws/portalfiles/portal/41586365/Pseudo-Three-Dimensional%20Back-Analysis%20Of%20Rainfall-Induced%20Landsl.pdf", //
    },
    {
      id: 7,
      title:
        "Assessing Social Vulnerability to Landslides in Rural Puerto Rico",
      description:
        "West, J., Rodríguez-Cruz, L. A., & Hughes, K. S. (2023). Steep Risks: Assessing Social Vulnerability to Landslides in Rural Puerto Rico (Natural Hazards Center Public Health Disaster Research Report Series, Report 34). Natural Hazards Center, University of Colorado Boulder. https://hazards.colorado.edu/public-health-disaster-research/steep-risks",
      image: pub7,
      url: "https://hazards.colorado.edu/public-health-disaster-research/steep-risks",
    },
    {
      id: 8,
      title:
        "Climato-tectonic evolution of siliciclastic sandstones on Puerto Rico: from lithic arenites to quartz-arenitic sands in an oceanic island-arc setting Available",
      description:
        "David K. Larue; Kimberly Mendez Mendez; José L. Corchado Albelo; Lauryn N. Martinez; K. Stephen Hughes; Thomas Hudgins; Hernan Santos; Alan L. Smith; Chris Osterberg. (2023). Climato-tectonic evolution of siliciclastic sandstones on Puerto Rico: from lithic arenites to quartz-arenitic sands in an oceanic island-arc setting, https://pubs.geoscienceworld.org/sepm/jsedres/article/93/11/857/625560/Climato-tectonic-evolution-of-siliciclastic",
      image: pub8,
      url: "https://pubs.geoscienceworld.org/sepm/jsedres/article/93/11/857/625560/Climato-tectonic-evolution-of-siliciclastic", 
    },
    {
      id: 9,
      title:
        "Geotechnical Impacts of Hurricane Fiona in Puerto Rico",
      description:
        "Morales, A.R., Hughes, S.K., Lang, K.D., Rivera-Hernandez, F.M., Vargas Vargas, P.V., Lozano, J.M., Karantanellis, E.P., Kassem, M.L., Gomberg, D.A., Plescher, R.T., Irizarry, E.J., Vicens, E.G., Figueroa, T.L., Friedman, C.M., Cunillera, K.N., Ruiz, A.L., and Ortega, V.J., University of Puerto Rico at Mayagüez, Georgia Institute of Technology, University of Michigan, University of California at Berkeley, Mar. 2023, Geotechnical Impacts of Hurricane Fiona in Puerto Rico, DOI:10.18118/G6Z38B",
      image: pub9,
      url: "https://www.geerassociation.org/components/com_geer_reports/geerfiles/GEER_HurricaneFiona_report.pdf",
    },
    {
      id: 10,
      title:
        "Principles for collaborative risk communication: Reducing landslide losses in Puerto Rico, Journal of Emergency Management",
      description:
        "West, J., Davis, L., Lugo Bendezú, R., Álvarez Gandía, Y.D., Hughes, K.S., Godt, J., and Peek, L., 2021, Principles for collaborative risk communication: Reducing landslide losses in Puerto Rico, Journal of Emergency Management, v. 19, no. 2, p. (pdf) https://hazards.colorado.edu/uploads/documents/principles-of-collaborative-risk-communication-puertorico-west-et-al-2021.pdf",
      image: pub10,
      url: "https://hazards.colorado.edu/uploads/documents/principles-of-collaborative-risk-communication-puertorico-west-et-al-2021.pdf",
    },
    {
      id: 11,
      title:
        "WIDESPREAD SHALLOW MASS WASTING DURING HURRICANE MARIA: LONG-TERM SIGNIFICANCE OF SEDIMENTATION IN THE TROPICS",
      description:
        "Edwin O. Irizarry-Brugman, Desiree Bayouth-García, Kenneth S. Hughes. (2021). WIDESPREAD SHALLOW MASS WASTING DURING HURRICANE MARIA: LONG-TERM SIGNIFICANCE OF SEDIMENTATION IN THE TROPICS",
      image: pub11,
      url: "https://www.scipedia.com/public/Irizarry-Brugman_et_al_2021a",
    },
    {
      id: 12,
      title:
        "Geotechnical Reconnaissance of the January 7, 2020 M6.4 Southwest Puerto Rico Earthquake and Associated Seismic Sequence, Geotechnical Extreme Events Reconnaissance",
      description:
        "Morales-Vélez, A.C., Bernal, J., Hughes, K.S., Pando, M., Pérez, J., and Rodríguez, L.A., 2020, Geotechnical Reconnaissance of the January 7, 2020 M6.4 Southwest Puerto Rico Earthquake and Associated Seismic Sequence, Geotechnical Extreme Events Reconnaissance Report No. 066, 55p. (link) http://www.geerassociation.org/administrator/components/com_geer_reports/geerfiles/GEER_PuertoRico_Report.pdf",
      image: pub12,
      url: "https://www.geerassociation.org/components/com_geer_reports/geerfiles/GEER_PuertoRico_Report.pdf",
    },
    {
      id: 13,
      title:
        "Landslide Science in Puerto Rico: Past, Present, and Future; Revista Internacional de Desastres Naturales, Accidentes e Infraestructura Civil",
      description:
        "Hughes, K.S., and Morales Vélez, A.C., 2020, Landslide Science in Puerto Rico: Past, Present, and Future; Revista Internacional de Desastres Naturales, Accidentes e Infraestructura Civil, v. 19-20, no. 1, p. 175-187. (pdf) https://drive.google.com/file/d/1NelGaHVMEOPSRbBWbDx4KqZiEKVz-vBe/view?usp=sharing",
      image: pub13,
      url: "https://drive.google.com/file/d/1NelGaHVMEOPSRbBWbDx4KqZiEKVz-vBe/view?usp=sharing",
    },
    {
      id: 14,
      title:
        "Map depicting susceptibility to landslides triggered by intense rainfall, Puerto Rico",
      description:
        "Hughes, K.S., and Schulz, W.H., 2020, Map depicting susceptibility to landslides triggered by intense rainfall, Puerto Rico: U.S. Geological Survey Open-File Report 2020-1022, 91 p., 1 plate, scale 1:150,000, https://doi.org/10.3133/ofr20201022",
      image: pub14,
      url: "https://doi.org/10.3133/ofr20201022",
    },
    {
      id: 15,
      title:
        "Landslides triggered by Hurricane Maria : Assessment of an extreme event in Puerto Rico",
      description:
        "Bessette-Kirton, E.K., Cerovski-Darriau, C., Schulz, W.H., Coe, J.A., Kean, J.W., Godt, J.W., Thomas, M.A., and Hughes, K.S., 2019, Landslides triggered by Hurricane Maria : Assessment of an extreme event in Puerto Rico, GSA Today v. 29, no. 6, p. 4-10. (https://www.geosociety.org/gsatoday/science/G383A/article.htm)",
      image: pub15,
      url: "https://www.geosociety.org/gsatoday/science/G383A/article.htm",
    },
    {
      id: 16,
      title:
        "Map of slope-failure locations in Puerto Rico after Hurricane María",
      description:
        "Hughes, K.S., Bayouth García, D., Martínez Milian, G.O., Schulz, W.H., and Baum, R.L., 2019, Map of slope-failure locations in Puerto Rico after Hurricane María: U.S. Geological Survey data release, https://doi.org/10.5066/P9BVMD74.",
      image: pub16,
      url: "https://doi.org/10.5066/P9BVMD74",
    },
    {
      id: 17,
      title:
        "Multi-Decadal Earth Dam Deformation Monitoring using Airborne LiDAR and Structure from Motion at Lago Guajataca, Puerto Rico",
      description:
        "Villareal Arango, A.F., Hughes, K.S., and Morales-Vélez, A.C., 2019, Multi-Decadal Earth Dam Deformation Monitoring using Airborne LiDAR and Structure from Motion at Lago Guajataca, Puerto Rico : Geocongress, American Society of Civil Engineers, (link). https://drive.google.com/file/d/1FAWv0tWDF84OkZpxUiUN8z8ZVsjIN7_2/view?usp=sharing",
      image: pub17,
      url: "https://drive.google.com/file/d/1FAWv0tWDF84OkZpxUiUN8z8ZVsjIN7_2/view?usp=sharing",
    },
    {
      id: 18,
      title:
        "Geotechnical Impacts of Hurricane Maria in Puerto Rico : Geotechnical Extreme Events Reconnaissance",
      description:
        "Silva-Tulla, F., Pando, M.A., Soto, A.E., Morales, A.C., Pradel, D., Inci, G., Sasanakul, I., Bernal, J.R., Kayen, R., Hughes, K.S., Adams, T., and Park, Y., 2018, Geotechnical Impacts of Hurricane Maria in Puerto Rico : Geotechnical Extreme Events Reconnaissance Report No. 057, 234 p. (link) http://www.geerassociation.org/administrator/components/com_geer_reports/geerfiles/180629_GEER_PR_Report_No_GEER-057.pdf",
      image: pub18,
      url: "https://geerassociation.org/components/com_geer_reports/geerfiles/180629_GEER_PR_Report_No_GEER-057.pdf",
    },
    {
      id: 19,
      title:
        "Comprehensive Hurricane María Mass Wasting Inventory and Improved Frequency Ratio Landslide Hazard Mapping: Status Update From the University of Puerto Rico at Mayagüez : Dimension, Colegio de Inginieros y Agrimensores de Puerto Rico",
      description:
        "Morales-Vélez, A.C., and Hughes, K.S., 2018, Comprehensive Hurricane María Mass Wasting Inventory and Improved Frequency Ratio Landslide Hazard Mapping: Status Update From the University of Puerto Rico at Mayagüez : Dimension, Colegio de Inginieros y Agrimensores de Puerto Rico, v. 1, p. 23-26. (link) https://drive.google.com/file/d/1wf6xLHbGjE38L3hGB8s2_R9jEWcXsZBa/view?usp=drivesdk",
      image: pub19,
      url: "https://drive.google.com/file/d/1wf6xLHbGjE38L3hGB8s2_R9jEWcXsZBa/view?usp=drivesdk",
    },
  ];
        setPublications(hardcodedPublications);
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
