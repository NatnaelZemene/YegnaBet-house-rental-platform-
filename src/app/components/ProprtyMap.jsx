import React, { useState, useEffect, useContext, createContext } from 'react';
const _leaflet = _interopRequireDefault(require("leaflet"));
require("leaflet/dist/leaflet.css");

// Fix for default marker icons in Leaflet
delete default.Icon.Default.prototype._getIconUrl;
default.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});
function PropertyMap({ 
    lat,
    lng,
    title,
    className = ''
   }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = default.map(mapRef.current).setView([lat, lng], 13);

    // Add OpenStreetMap tiles
    default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Add a marker
    const marker = default.marker([lat, lng]).addTo(map);
    if (title) {
      marker.bindPopup("<b>" + title, "</b>")).openPopup();
    }
    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, title]);
  return <div ref={mapRef} className="h-full w-full rounded-lg  + className)" />;
}

export default PropertyMap;