import "../styles/MapMenu.css";
import { useState } from "react";
import layersIcon from "../assets/layers-icon.png";
import historyIcon from "../assets/history-icon.png";

export default function MapMenu({
  showStations,
  onToggleStations,
  showPrecip,
  onTogglePrecip,
  showSusceptibility,
  onToggleSusceptibility,
  availableYears,
  selectedYear,
  onYearChange,
}) {
  const [activeMenu, setActiveMenu] = useState(null); // null | 'layers' | 'history'

  const toggleLayers = () => {
    setActiveMenu((prev) => (prev === "layers" ? null : "layers"));
  };

  const toggleHistory = () => {
    setActiveMenu((prev) => (prev === "history" ? null : "history"));
  };

  return (
    <div className={`map-menu ${activeMenu ? "expanded" : ""}`}>
      <div className="menu-row">
        <button
          className={`icon-btn ${activeMenu === "layers" ? "active" : ""}`}
          onClick={toggleLayers}
          title="Layers"
        >
          <img src={layersIcon} alt="Layers" className="menu-icon" />
        </button>

        <button
          className={`icon-btn ${activeMenu === "history" ? "active" : ""}`}
          onClick={toggleHistory}
          title="History"
        >
          <img src={historyIcon} alt="History" className="menu-icon" />
        </button>
      </div>

      {activeMenu === "layers" && (
        <div className="filters">
          <label>
            <input
              type="checkbox"
              checked={showStations}
              onChange={onToggleStations}
            />
            Stations
          </label>

          <label>
            <input
              type="checkbox"
              checked={showPrecip}
              onChange={onTogglePrecip}
            />
            Precipitation Layer
          </label>

          <label>
            <input
              type="checkbox"
              checked={showSusceptibility}
              onChange={onToggleSusceptibility}
            />
            Susceptibility Layer
          </label>
        </div>
      )}


      {activeMenu === "history" && (
        <div className="filters">
          <div className="filter-title">Filter Landslides by Year</div>
          <label>
            <input
              type="checkbox"
              checked={selectedYear === "all"}
              onChange={() =>
                onYearChange(selectedYear === "all" ? "" : "all") // toggle off if clicked again
              }
            />
            All Years
          </label>

          {availableYears.map((year) => (
            <label key={year}>
              <input
                type="checkbox"
                checked={selectedYear === String(year)}
                onChange={() =>
                  onYearChange(
                    selectedYear === String(year) ? "all" : String(year) // select year or revert to all
                  )
                }
              />
              {year}
            </label>
          ))}
        </div>
      )}

    </div>
  );
}
