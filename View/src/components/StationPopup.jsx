import React from 'react';
import { Popup } from 'react-leaflet';
import './StationPopup.css';

const StationPopup = ({ station }) => {
  if (!station){
    return null;
  }
  const soilSaturation = station.soil_saturation;
  const lastUpdated = station.last_updated;
  const city = station.city;
  const precip = station.precipitation;

  return (
    <Popup>
      <div className="custom-popup-content">
        <div className="info roboto-condensed">
          <h2 className="bebas-neue" style={{ marginBottom: '8px' }}>
            {city}
          </h2>

          <ul>
            <li>
              <strong>Last Updated:</strong> {lastUpdated} AST
            </li>
            <li>
              <strong>Soil Saturation:</strong> {soilSaturation}%
            </li>
            <li>
              <strong>12 HRS Precipitation:</strong> {precip} inches
            </li>
          </ul>
        </div>
      </div>
    </Popup>
  );
};

export default StationPopup;