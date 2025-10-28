import React from 'react';
import { Popup } from 'react-leaflet';

const LandslidePopup = ({ landslide }) => {
  if (!landslide) {
    return null;
  }

  const landslideId = landslide.landslide_id;
  const reportedDate = landslide.landslide_date;
  const latitude = landslide.latitude;
  const longitude = landslide.longitude;

  return (
    <Popup>
    <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
      <div className="custom-popup-content">
        <div className="info roboto-condensed text-gray-800">

          <h2 className="bebas-neue text-lg font-bold text-red-700" style={{ marginBottom: '8px' }}>
            Reported Landslide Event
          </h2>

          <ul className="list-none p-0 m-0 space-y-1 text-sm">
            <li>
              <strong className="font-semibold">ID:</strong> {landslideId}
            </li>
            <li>
              <strong className="font-semibold">Reported Date:</strong> {reportedDate}
            </li>
            <li>
              <strong className="font-semibold">Latitude:</strong> {latitude}
            </li>
            <li>
              <strong className="font-semibold">Longitude:</strong> {longitude}
            </li>
          </ul>
          
        </div>
      </div>
    </div>
    </Popup>
  );
};

export default LandslidePopup;
