import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

function PropertyMap({ property }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = property.location;
  const hasCoordinates = location?.coordinates?.latitude && location?.coordinates?.longitude;

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Only load Google Maps if we have coordinates
    if (!hasCoordinates) {
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_BcqbYqhQhAo&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Add global callback function
    window.initGoogleMaps = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [hasCoordinates]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !hasCoordinates) return;

    try {
      const center = {
        lat: location.coordinates.latitude,
        lng: location.coordinates.longitude
      };

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 16,
        center: center,
        mapTypeId: 'roadmap',
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add marker for property
      const marker = new window.google.maps.Marker({
        position: center,
        map: map,
        title: property.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C11.6 2 8 5.6 8 10C8 16 16 30 16 30S24 16 24 10C24 5.6 20.4 2 16 2ZM16 14C13.8 14 12 12.2 12 10C12 7.8 13.8 6 16 6C18.2 6 20 7.8 20 10C20 12.2 18.2 14 16 14Z" fill="#dc2626"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });

      markerRef.current = marker;

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${property.title}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${location.address}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${location.subcity}, ${location.woreda}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [isLoaded, hasCoordinates, property, location]);
  
  const handleGetDirections = () => {
    if (hasCoordinates) {
      const { latitude, longitude } = location.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    } else {
      const address = `${location?.address}, ${location?.subcity}, ${location?.woreda}, Addis Ababa, Ethiopia`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handleViewArea = () => {
    if (hasCoordinates) {
      const { latitude, longitude } = location.coordinates;
      window.open(`https://www.google.com/maps/@${latitude},${longitude},16z`, '_blank');
    } else {
      const address = `${location?.subcity}, Addis Ababa, Ethiopia`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
            <div className="text-gray-600 space-y-1">
              <p>{location?.address}</p>
              <p>{location?.subcity}, Woreda {location?.woreda}</p>
              <p>Addis Ababa, Ethiopia</p>
              {hasCoordinates && (
                <div className="mt-2 text-xs text-gray-500 font-mono">
                  <p>📍 {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map or Placeholder */}
      {hasCoordinates ? (
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg z-10">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full h-64 rounded-lg border border-gray-300"
            style={{ minHeight: '256px' }}
          />
        </div>
      ) : (
        // Fallback placeholder when no coordinates
        <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="font-medium">Location Map</p>
              <p className="text-sm">Exact coordinates not available</p>
              <p className="text-xs mt-1">Click "Get Directions" to view in Google Maps</p>
            </div>
          </div>
          
          {/* Overlay with property marker */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">{property.title}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleGetDirections} className="flex-1">
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleViewArea}>
          <MapPin className="w-4 h-4 mr-2" />
          View Area
        </Button>
      </div>

      {/* Nearby Places */}
      {location?.nearbyPlaces && location.nearbyPlaces.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Nearby Places</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {location.nearbyPlaces.slice(0, 6).map((place, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{place.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{place.type}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {place.distance ? `${Math.round(place.distance)}m` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyMap;