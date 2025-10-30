import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap, Marker } from 'react-leaflet';
import * as EL from 'esri-leaflet';
import LandslideLogo from '../assets/Landslide_Hazard_Mitigation_Logo.avif';
import StationPopup from '../components/StationPopup';
import LandslidePopup from '../components/LandslidePopup';
import L from 'leaflet';

const BASE_STATIONS_URL = "http://localhost:8001/api/stations"
const BASE_LANDSLIDES_URL = "http://localhost:8001/api/landslides";

const Disclaimer = ({ onAgree }) => {
    return (
        <div className="disclaimer-overlay">
            <div className="disclaimer-box">
                <h2>Aviso | Disclaimer</h2>
                <p>
                    <strong>EN:</strong> The data presented on this platform is experimental. The Puerto Rico Landslide Hazard Mitigation Office is not responsible for the decisions taken after utilizing our data. By proceeding, you acknowledge and accept this disclaimer.
                </p>
                <p>
                    <strong>ES:</strong> Los datos presentados en esta plataforma son experimentales. La Oficina de Mitigación ante Deslizamientos de Puerto Rico no se hace responsable de las decisiones tomadas utilizando nuestra información. Al continuar, usted reconoce y acepta este aviso.
                </p>
                <button onClick={onAgree}>
                    Acepto | Agree
                </button>
            </div>
        </div>
    );
};

const EsriOverlays = () => {
    const map = useMap();
    useEffect(() => {
        const hillshade = EL.tiledMapLayer({
            url: 'https://tiles.arcgis.com/tiles/TQ9qkk0dURXSP7LQ/arcgis/rest/services/Hillshade_Puerto_Rico/MapServer',
            opacity: 0.5,
        }).addTo(map);

        const municipalities = EL.featureLayer({
            url: 'https://services5.arcgis.com/TQ9qkk0dURXSP7LQ/arcgis/rest/services/LIMITES_LEGALES_MUNICIPIOS/FeatureServer/0',
            style: () => ({ color: 'black', weight: 1, fillOpacity: 0 }),
        }).addTo(map);

        const precip = EL.imageMapLayer({
            url: 'https://mapservices.weather.noaa.gov/raster/rest/services/obs/mrms_qpe/ImageServer',
            opacity: 0.5,
            renderingRule: { rasterFunction: 'rft_12hr' },
        }).addTo(map);

        return () => {
            map.removeLayer(hillshade);
            map.removeLayer(municipalities);
            map.removeLayer(precip);
        };
    }, [map]);
    return null;
};

const PopulateStations = () => {
    const [station, setStations] = useState([]);

    useEffect(() => {
        fetch(BASE_STATIONS_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setStations(data);
            })
            .catch((err) => {
                console.error("API Fetch Error:", err);
            });
    }, []);

    const createStationIcon = (saturation) => {
        let className = 'saturation-marker';

        if (saturation >= 90) {
            className += ' high';
        } else if (saturation >= 80){
            className += ' medium';
        }else {
            className += ' low';
        }

        const roundedSaturation = Math.round(saturation);

        return L.divIcon({
            html: `<div class="${className}">${roundedSaturation}%</div>`,
            className: '',
            iconSize: [55, 30],
            iconAnchor: [27, 15],
        });
    };

    return (
        <>
            {station.map(station => {
                if (station.is_available === 1 && station.soil_saturation != null) {
                    const customIcon = createStationIcon(station.soil_saturation);

                    return (
                        <Marker
                            key={station.id}
                            position={[station.latitude, station.longitude]}
                            icon={customIcon}
                        >
                            <StationPopup station={station} />
                        </Marker>
                    );
                }
                return null;
            })}
        </>
    );
}

const createLandslideIcon = () => {
    const iconHtml = `
    <div style="
      background-color: #dc2626; /* Red color */
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 3px solid #7f1d1d; /* Darker red border */
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
    "></div>
  `;

    return L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
    });
};

const YearFilter = ({ selectedYear, availableYears, onYearChange }) => {
    return (
        <div className="year-filter-container">
            <label htmlFor="year-select">Filter Landslides by Year:</label>
            <select id="year-select" value={selectedYear} onChange={onYearChange}>
                <option value="all">All Years</option>
                {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
}

const PopulateLandslides = () => {
    const [allLandslides, setAllLandslides] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('all');

    const customIcon = createLandslideIcon();

    useEffect(() => {
        fetch(BASE_LANDSLIDES_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setAllLandslides(data);

                const years = data.map(ls => {
                    if (!ls.landslide_date) return null;
                    return new Date(ls.landslide_date).getFullYear();
                });

                const uniqueYears = [...new Set(years)]
                    .filter(year => !isNaN(year) && year !== null)
                    .sort((a, b) => b - a);

                setAvailableYears(uniqueYears);
            })
            .catch((err) => {
                console.error("API Fetch Error:", err);
            });
    }, []);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const filteredLandslides = allLandslides.filter(landslide => {
        if (selectedYear === 'all') {
            return true;
        }
        if (!landslide.landslide_date) return false;

        const eventYear = new Date(landslide.landslide_date).getFullYear();
        return eventYear === parseInt(selectedYear);
    });

    return (
        <>
            <YearFilter
                selectedYear={selectedYear}
                availableYears={availableYears}
                onYearChange={handleYearChange}
            />

            {filteredLandslides.map(landslide => (
                <Marker
                    key={landslide.landslide_id}
                    position={[landslide.latitude, landslide.longitude]}
                    icon={customIcon}
                >
                    <LandslidePopup landslide={landslide} />
                </Marker>
            ))}
        </>
    );
}

const AddLegend = () => {
    return(
        <div className="legend-container">
            <div className="legend-item">
                <span className="saturation-marker low"></span>
                0-80%
            </div>
            <div className="legend-item">
                <span className="saturation-marker medium"></span>
                80-90%
            </div>
            <div className="legend-item">
                <span className="saturation-marker high"></span>
                90-100%
            </div>
        </div>
    );
}

export default function InteractiveMap() {
    const center = [18.220833, -66.420149];

    const [showDisclaimer, setShowDisclaimer] = useState(
        localStorage.getItem('disclaimerAccepted') !== 'true'
    );

    const handleAgree = () => {
        localStorage.setItem('disclaimerAccepted', 'true');
        setShowDisclaimer(false);
    };
    return (
        <main>
            {showDisclaimer && <Disclaimer onAgree={handleAgree} />}
            <div className="map-label">SOIL SATURATION PERCENTAGE</div>
            <MapContainer
                id="map"
                center={center}
                zoom={10}
                minZoom={7}
                maxZoom={18}
                scrollWheelZoom={false}
                zoomControl={false}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles © Esri"
                />

                <ZoomControl position="topleft" />
                <EsriOverlays />
                <PopulateStations />
                <PopulateLandslides />
                <AddLegend/>

                <div className="logo-container">
                    <img src={LandslideLogo} alt="Landslide Hazard Mitigation Logo" className="landslide-logo" />
                </div>
            </MapContainer>
        </main>
    );
}