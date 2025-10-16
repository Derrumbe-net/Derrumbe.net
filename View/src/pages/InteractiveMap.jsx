import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import React, { useEffect} from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import * as EL from 'esri-leaflet';
import LandslideLogo from '../../../assets/images/Landslide_Hazard_Mitigation_Logo.avif';


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
        <div className="logo-container">
          <img src={LandslideLogo} alt="Landslide Hazard Mitigation Logo" className="landslide-logo" />
        </div>
      </MapContainer>
    </main>
  );
}
