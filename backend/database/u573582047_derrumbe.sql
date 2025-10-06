-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 06, 2025 at 04:12 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u573582047_derrumbe`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `email`, `password`) VALUES
(1, 'jose.irizarry24@upr.edu', 'temp_pw');

-- --------------------------------------------------------

--
-- Table structure for table `landslide`
--

CREATE TABLE `landslide` (
  `landslide_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `landslide_date` datetime NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `landslide`
--

INSERT INTO `landslide` (`landslide_id`, `admin_id`, `landslide_date`, `latitude`, `longitude`) VALUES
(1, 1, '2025-10-06 04:07:56', 18.210900, 67.140900);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `project_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `start_year` smallint(5) UNSIGNED DEFAULT NULL,
  `end_year` smallint(5) UNSIGNED DEFAULT NULL,
  `project_status` enum('planned','active','paused','completed','archived') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `admin_id`, `title`, `start_year`, `end_year`, `project_status`, `description`, `image_url`) VALUES
(1, 1, 'Evaluation of the Soil Mass Movement Risk Rating in Puerto Rico using the SLIDES-PR Hurricane María Slope Failure Inventory.', 2019, 2021, 'completed', '2019-2021 ($50,098) Acuerdo de cooperación entre el USDA y el NRCS NR20F3520001C001: \"Evaluación de la calificación de riesgo de movimiento de masas de suelo en Puerto Rico utilizando el inventario de fallas de taludes del huracán María de SLIDES-PR\". Este proyecto condujo a una comprensión mucho mejor del papel de la composición y las características del suelo en los deslizamientos de tierra superficiales en Puerto Rico.', NULL),
(2, 1, 'Collaborative Research: Quantifying controls on weathering of volcanic arc rocks.', 2020, 2022, 'completed', '2020-2022 ($117,469) Premio NSF de Ciencias de la Tierra #2011358: \"Investigación colaborativa: cuantificación de los controles sobre la erosión de las rocas de arco volcánico\". El objetivo de este proyecto era medir cómo la erosión química de las rocas volcánicas e ígneas ricas en hierro depende del suministro de minerales frescos por erosión física. Esta relación es fundamental para comprender el papel de los procesos tectónicos en el control del ciclo global del carbono y el clima a través del tiempo geológico. Colaborador: Universidad de Purdue', NULL),
(3, 1, 'Track I Center Catalyst: Collaborative Center for Landslides and Ground Failure Geohazards.', 2022, 2024, 'completed', '2022-2024 ($89,700) Premio NSF de Ciencias de la Tierra #2224973: \"Track I Center Catalyst: Collaborative Center for Landslides and Ground Failure Geohazards\". Este proyecto se centró en la investigación relacionada con las causas fundamentales y los mecanismos desencadenantes de los deslizamientos de tierra, así como en el desarrollo de una comprensión de los peligros que se generan a partir de los derrumbes del terreno. Este proyecto de Track I utilizó a Puerto Rico como un laboratorio viviente para estudiar los deslizamientos de tierra y su impacto en la comunidad. Colaboradores: Georgia Tech, Universidad de Colorado.', NULL),
(4, 1, 'Collaborative Research: RAPID: The fate of landslide-derived sediment following tropical cyclones: a case study of Hurricane Fiona in Puerto Rico.', 2022, 2023, 'completed', '2022-2023 ($21,750) Premio NSF de Ciencias de la Tierra #2301379: \"Investigación colaborativa: RAPID: El destino de los sedimentos derivados de deslizamientos de tierra después de ciclones tropicales: un estudio de caso del huracán Fiona en Puerto Rico\". Este proyecto respaldó la recopilación de datos perecederos y sensibles al tiempo de las cuencas fluviales montañosas de Puerto Rico fuertemente afectadas por el vertido masivo después del huracán Fiona. Colaboradores: Georgia Tech', NULL),
(6, 1, 'LandslideReady community engagement program in Puerto Rico 2024-2026.', 2024, 2026, 'active', '2024-2026 ($473,895) Acuerdo de cooperación del USGS n.º G24AC00484: \"Programa de participación comunitaria LandslideReady en Puerto Rico 2024-2026\". El propósito de este acuerdo es apoyar la investigación y la recopilación de datos relacionados con la implementación y el análisis de un programa de certificación municipal estructurado LandslideReady en Puerto Rico (PR). LandslideReady está modelado a partir de los exitosos esfuerzos StormReady y TsunamiReady del NWS. En los últimos años, la Oficina de Mitigación de Peligros de Deslizamientos de Tierra de PR (PRLHMO) ha codiseñado una versión piloto de LandslideReady con aportes de científicos físicos, científicos sociales, el gobierno federal/estatal/local, la industria privada, líderes comunitarios, grupos sin fines de lucro y otros socios ciudadanos. Las oficinas de gestión de emergencias municipales son los grupos objetivo que se certificarán como LandslideReady.', NULL),
(7, 1, 'Climate Adaptation Partnerships: Caribbean Climate Adaptation Network: Building equitable adaptive capacities of the USVI and Puerto Rico.', 2022, 2027, 'active', '2022-2027 ($462,505) NOAA Climate Program Office Award #NA22OAR4310545: \"Asociaciones de adaptación climática: Red de adaptación climática del Caribe: creación de capacidades de adaptación equitativas de las Islas Vírgenes de los Estados Unidos y Puerto Rico\". Este esfuerzo busca mejorar y expandir las asociaciones mediante el desarrollo y la convocatoria de partes interesadas en Puerto Rico y las Islas Vírgenes de los Estados Unidos. La red de conocimiento y acción propuesta está diseñada para ayudar a desarrollar capacidades de adaptación para futuros extremos climáticos, planificar respuestas a peligros climáticos en cascada y crisis de gobernanza. Colaboradores: UPR Ciencias Médicas, Universidad de las Islas Vírgenes, Universidad de Texas, Universidad de Nueva York, Instituto Politécnico de Worcester', NULL),
(8, 1, 'Puerto Rico Landslide Hazard Reduction Project 2023-2025.', 2023, 2026, 'active', '2023-2026 ($499,956) Acuerdo de cooperación del USGS n.° G23AC00479: \"Proyecto de reducción del riesgo de deslizamientos de tierra en Puerto Rico 2023-2025\". Esta adjudicación amplía un acuerdo vigente entre el Programa de riesgo de deslizamientos de tierra del USGS y la Universidad de Puerto Rico en Mayagüez para establecer y operar una red de monitoreo hidrológico del suelo casi en tiempo real. El nuevo acuerdo ayudará a expandir la red de monitoreo hidrológico actual (de 15 estaciones actuales a al menos 20 estaciones) y brindará un medio para mantener la red funcional, complementando así una nueva \"Oficina de mitigación del riesgo de deslizamientos de tierra en Puerto Rico\" en el campus de la UPRM. El objetivo del esfuerzo de investigación y recopilación de datos es desarrollar métricas de pronóstico de deslizamientos de tierra en todo el territorio de la isla para usarlas en un sistema operativo.', NULL),
(10, 1, 'Landslide Hazard Science and Risk Communication in Puerto Rico.', 2024, 2026, 'active', '2024-2026 ($149,998) Premio #2024-00188 del Fideicomiso de Ciencia, Tecnología e Investigación de Puerto Rico: \"Ciencia y comunicación de riesgos de deslizamientos de tierra en Puerto Rico\". Este proyecto apoyará el desarrollo e implementación de un sistema operativo y en tiempo real de pronóstico de deslizamientos de tierra en Puerto Rico.', NULL),
(12, 1, 'Collaborative Research: Testing Critical Zone Controls on Mountain-Scale Relief in a Tropical Climate.', 2022, 2025, 'active', '2022-2025 ($284,503) Premio NSF de Ciencias de la Tierra #2139895: \"Investigación colaborativa: prueba de controles de zonas críticas en relieve a escala montañosa en un clima tropical\". Este proyecto examina cómo las diferencias en los procesos de la zona crítica influyen en la topografía a través de un experimento comparativo de dos unidades de lecho rocoso diferentes en la isla tropical de Puerto Rico. Colaborador: Universidad Estatal de Colorado', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `publication`
--

CREATE TABLE `publication` (
  `publication_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `publication_url` varchar(512) NOT NULL,
  `image_url` varchar(512) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `publication`
--

INSERT INTO `publication` (`publication_id`, `admin_id`, `title`, `publication_url`, `image_url`, `description`) VALUES
(3, 1, 'Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico', 'https://srv1507-files.hstgr.io/758a3c3726988e66/files/public_html/website_publications/belgica_gsa.pdf', NULL, 'Rodríguez-Feliciano, César A.; Hughes, K. Stephen; Vélez-Santiago, Freddie; Department of Geology, University of Puerto Rico, Mayagüez, PR; Guánica, PR. (2025). Tracking a limestone bedrock landslide on an urbanized hillslope in Guanica, Puerto Rico.'),
(4, 1, 'Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico', 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776', NULL, 'Angus K. Moore, Kimberly Méndez Méndez, K. Stephen Hughes, Darryl E. Granger. (2025). Chemical Weathering and Physical Erosion Fluxes From Serpentinite in Puerto Rico,https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2024JF007776'),
(5, 1, 'Dynamic Landslide Susceptibility for Extreme Rainfall Events Using an Optimized Convolutional Neural Network Approach', 'https://link.springer.com/content/pdf/10.1007/s11069-025-07396-9.pdf', NULL, 'Mejia-Manrique, S.A., Ramos-Scharrón, C.E., Hughes, K.S., Gonzalez-Cruz, J.E., and Khanbilvardi, R.M., 2025, Dynamic Landslide Susceptibility for Extreme Rainfall Events Using an Optimized Convolutional Neural Network Approach'),
(6, 1, 'Neotectonic Mapping of Puerto Rico', 'https://seismica.library.mcgill.ca/article/view/1102', NULL, NULL),
(7, 1, 'Volcanic arc weathering rates in the humid tropics controlled by the interplay between physical erosion and precipitation', 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2023AV001066', NULL, NULL),
(8, 1, 'Pseudo-Three-Dimensional Back-Analysis Of Rainfall-Induced Landslides In Utuado, Puerto Rico', 'https://mst.elsevierpure.com/ws/portalfiles/portal/41586365/Pseudo-Three-Dimensional%20Back-Analysis%20Of%20Rainfall-Induced%20Landsl.pdf', NULL, NULL),
(9, 1, 'Assessing Social Vulnerability to Landslides in Rural Puerto Rico', 'https://hazards.colorado.edu/public-health-disaster-research/steep-risks', NULL, NULL),
(10, 1, 'Climato-tectonic evolution of siliciclastic sandstones on Puerto Rico: from lithic arenites to quartz-arenitic sands in an oceanic island-arc setting ', 'https://pubs.geoscienceworld.org/sepm/jsedres/article/93/11/857/625560/Climato-tectonic-evolution-of-siliciclastic', NULL, NULL),
(11, 1, 'Geotechnical Impacts of Hurricane Fiona in Puerto Rico', 'https://www.geerassociation.org/components/com_geer_reports/geerfiles/GEER_HurricaneFiona_report.pdf', NULL, NULL),
(12, 1, 'Principles for collaborative risk communication: Reducing landslide losses in Puerto Rico, Journal of Emergency Management', 'https://hazards.colorado.edu/uploads/documents/principles-of-collaborative-risk-communication-puertorico-west-et-al-2021.pdf', NULL, NULL),
(13, 1, 'WIDESPREAD SHALLOW MASS WASTING DURING HURRICANE MARIA: LONG-TERM SIGNIFICANCE OF SEDIMENTATION IN THE TROPICS', 'https://www.scipedia.com/public/Irizarry-Brugman_et_al_2021a', NULL, NULL),
(14, 1, 'Geotechnical Reconnaissance of the January 7, 2020 M6.4 Southwest Puerto Rico Earthquake and Associated Seismic Sequence, Geotechnical Extreme Events ', 'https://www.geerassociation.org/components/com_geer_reports/geerfiles/GEER_PuertoRico_Report.pdf', NULL, NULL),
(15, 1, 'Landslide Science in Puerto Rico: Past, Present, and Future; Revista Internacional de Desastres Naturales, Accidentes e Infraestructura Civil', 'https://drive.google.com/file/d/1NelGaHVMEOPSRbBWbDx4KqZiEKVz-vBe/view?usp=sharing', NULL, NULL),
(16, 1, 'Map depicting susceptibility to landslides triggered by intense rainfall, Puerto Rico', 'https://doi.org/10.3133/ofr20201022', NULL, NULL),
(17, 1, 'Landslides triggered by Hurricane Maria : Assessment of an extreme event in Puerto Rico', 'https://www.geosociety.org/gsatoday/science/G383A/article.htm', NULL, NULL),
(18, 1, 'Map of slope-failure locations in Puerto Rico after Hurricane María', 'https://doi.org/10.5066/P9BVMD74', NULL, NULL),
(19, 1, 'Multi-Decadal Earth Dam Deformation Monitoring using Airborne LiDAR and Structure from Motion at Lago Guajataca, Puerto Rico', 'https://drive.google.com/file/d/1FAWv0tWDF84OkZpxUiUN8z8ZVsjIN7_2/view?usp=sharing', NULL, NULL),
(20, 1, 'Geotechnical Impacts of Hurricane Maria in Puerto Rico : Geotechnical Extreme Events Reconnaissance', 'https://geerassociation.org/components/com_geer_reports/geerfiles/180629_GEER_PR_Report_No_GEER-057.pdf', NULL, NULL),
(21, 1, 'Comprehensive Hurricane María Mass Wasting Inventory and Improved Frequency Ratio Landslide Hazard Mapping: Status Update From the University of Puert', 'https://drive.google.com/file/d/1wf6xLHbGjE38L3hGB8s2_R9jEWcXsZBa/view?usp=drivesdk', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `landslide_id` int(11) NOT NULL,
  `reported_at` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `image_url` varchar(512) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `reporter_name` varchar(100) DEFAULT NULL,
  `reporter_phone` varchar(30) DEFAULT NULL,
  `reporter_email` varchar(255) DEFAULT NULL,
  `physical_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`report_id`, `landslide_id`, `reported_at`, `description`, `city`, `image_url`, `latitude`, `longitude`, `reporter_name`, `reporter_phone`, `reporter_email`, `physical_address`) VALUES
(1, 1, '2025-10-05 00:09:50', 'Mock_Description', 'Mock_City', NULL, 18.210900, 67.140900, 'John Doe', '777-777-7777', 'john.doe@test.com', 'mock_address');

-- --------------------------------------------------------

--
-- Table structure for table `station_info`
--

CREATE TABLE `station_info` (
  `station_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `soil_saturation` int(10) UNSIGNED NOT NULL,
  `precipitation` decimal(6,2) DEFAULT NULL,
  `sensor_image_url` varchar(512) DEFAULT NULL,
  `data_image_url` varchar(512) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 0,
  `last_updated` datetime DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `station_info`
--

INSERT INTO `station_info` (`station_id`, `admin_id`, `soil_saturation`, `precipitation`, `sensor_image_url`, `data_image_url`, `city`, `is_available`, `last_updated`, `latitude`, `longitude`) VALUES
(1, 1, 1, 1.00, NULL, NULL, 'mock_city', 1, '2025-10-05 00:11:13', 18.210900, 67.140900);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `landslide`
--
ALTER TABLE `landslide`
  ADD PRIMARY KEY (`landslide_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `publication`
--
ALTER TABLE `publication`
  ADD PRIMARY KEY (`publication_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `idx_report_landslide` (`landslide_id`);

--
-- Indexes for table `station_info`
--
ALTER TABLE `station_info`
  ADD PRIMARY KEY (`station_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `landslide`
--
ALTER TABLE `landslide`
  MODIFY `landslide_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `publication`
--
ALTER TABLE `publication`
  MODIFY `publication_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `station_info`
--
ALTER TABLE `station_info`
  MODIFY `station_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `landslide`
--
ALTER TABLE `landslide`
  ADD CONSTRAINT `landslide_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `publication`
--
ALTER TABLE `publication`
  ADD CONSTRAINT `publication_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`landslide_id`) REFERENCES `landslide` (`landslide_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `station_info`
--
ALTER TABLE `station_info`
  ADD CONSTRAINT `station_info_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
