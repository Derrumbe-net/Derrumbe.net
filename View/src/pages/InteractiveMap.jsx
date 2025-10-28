import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap, Marker } from 'react-leaflet';
import * as EL from 'esri-leaflet';
import LandslideLogo from '../assets/Landslide_Hazard_Mitigation_Logo.avif';
import StationPopup from '../components/StationPopup';
import LandslidePopup from '../components/LandslidePopup';
import L from 'leaflet'; 

const BASE_STATIONS_URL = "https://derrumbe-test.derrumbe.net/api/stations"
const BASE_LANDSLIDES_URL = "https://derrumbe-test.derrumbe.net/api/landslides";

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

    // Classify Saturation type (low - medium - high)
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
      className: '', // Keep this empty to prevent Leaflet's default styles
      iconSize: [55, 30], // **MATCH THESE TO CSS width/height**
      iconAnchor: [27, 15], // **Adjust icon anchor to roughly center the rectangle** (width/2, height/2)
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

/**
 * Creates a custom icon for landslide markers.
 */
 const createLandslideIcon = () => {
  // Using a custom divIcon for a visually distinct landslide marker
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
    className: '', // Clear default Leaflet class
    iconSize: [26, 26], // Size of the visible part
    iconAnchor: [13, 13], // Center the icon
  });
};

const PopulateLandslides = () => {
const [landslides, setLandslides] = useState([]);

useEffect(() => {
  fetch(BASE_LANDSLIDES_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      setLandslides(data);
    })
    .catch((err) => {
      console.error("API Fetch Error:", err); 
    });
}, []);

const customIcon = createLandslideIcon();

return (
  <>
    {landslides.map(landslide => (
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

  return (
    <main>
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
