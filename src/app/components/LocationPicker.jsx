import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Search,
  Target,
  Edit
} from 'lucide-react';

function LocationPicker({ 
  initialCoordinates = null, 
  onLocationSelect, 
  address = '',
  subcity = '',
  woreda = ''
}) {
  const [selectedLocation, setSelectedLocation] = useState(initialCoordinates);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualCoords, setManualCoords] = useState({
    latitude: initialCoordinates?.latitude || '',
    longitude: initialCoordinates?.longitude || ''
  });

  // Default coordinates for Addis Ababa subcities
  const subcityCoordinates = {
    'Bole': { latitude: 8.9806, longitude: 38.7578 },
    'Kirkos': { latitude: 9.0320, longitude: 38.7469 },
    'Arada': { latitude: 9.0320, longitude: 38.7469 },
    'Addis Ketema': { latitude: 9.0320, longitude: 38.7469 },
    'Lideta': { latitude: 9.0320, longitude: 38.7469 },
    'Kolfe Keranio': { latitude: 9.0320, longitude: 38.7469 },
    'Gullele': { latitude: 9.0320, longitude: 38.7469 },
    'Yeka': { latitude: 9.0320, longitude: 38.7469 },
    'Nifas Silk-Lafto': { latitude: 8.9806, longitude: 38.7578 },
    'Akaky Kaliti': { latitude: 8.9806, longitude: 38.7578 }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        setSelectedLocation(coordinates);
        setManualCoords({
          latitude: coordinates.latitude.toString(),
          longitude: coordinates.longitude.toString()
        });
        
        if (onLocationSelect) {
          onLocationSelect(coordinates);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location. Please enter coordinates manually.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const useSubcityLocation = () => {
    if (subcity && subcityCoordinates[subcity]) {
      const coordinates = subcityCoordinates[subcity];
      setSelectedLocation(coordinates);
      setManualCoords({
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString()
      });
      
      if (onLocationSelect) {
        onLocationSelect(coordinates);
      }
    }
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualCoords.latitude);
    const lng = parseFloat(manualCoords.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }
    
    const coordinates = { latitude: lat, longitude: lng };
    setSelectedLocation(coordinates);
    
    if (onLocationSelect) {
      onLocationSelect(coordinates);
    }
    
    setManualEntry(false);
  };

  const resetLocation = () => {
    setSelectedLocation(null);
    setManualCoords({ latitude: '', longitude: '' });
    
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  const openInGoogleMaps = () => {
    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;
      window.open(`https://www.google.com/maps/@${latitude},${longitude},16z`, '_blank');
    } else if (subcity) {
      const searchQuery = `${address}, ${subcity}, Addis Ababa, Ethiopia`;
      const encodedQuery = encodeURIComponent(searchQuery);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Set the exact GPS coordinates of your property
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center gap-2"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Target className="h-4 w-4" />
            )}
            Use Current Location
          </Button>
          
          {subcity && (
            <Button
              variant="outline"
              size="sm"
              onClick={useSubcityLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Use {subcity} Center
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setManualEntry(!manualEntry)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Enter Manually
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetLocation}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Manual Entry Form */}
        {manualEntry && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Enter GPS Coordinates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  placeholder="9.0320"
                  value={manualCoords.latitude}
                  onChange={(e) => setManualCoords(prev => ({ ...prev, latitude: e.target.value }))}
                  className="text-sm"
                />
                <p className="text-xs text-blue-600 mt-1">Range: -90 to 90</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  placeholder="38.7469"
                  value={manualCoords.longitude}
                  onChange={(e) => setManualCoords(prev => ({ ...prev, longitude: e.target.value }))}
                  className="text-sm"
                />
                <p className="text-xs text-blue-600 mt-1">Range: -180 to 180</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleManualCoordinates}>
                Set Location
              </Button>
              <Button size="sm" variant="outline" onClick={() => setManualEntry(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Map Placeholder with Instructions */}
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-300 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Location Selection</h3>
              <p className="text-sm text-blue-700 mb-4">
                Use the buttons above to set your property's exact location
              </p>
              <div className="space-y-2 text-xs text-blue-600">
                <p>• Use "Current Location" for GPS detection</p>
                <p>• Use "{subcity} Center" for approximate area</p>
                <p>• Use "Enter Manually" for precise coordinates</p>
              </div>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Property Location</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 mb-2">Location Set Successfully</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700 font-medium">Latitude:</span>
                    <span className="ml-2 text-green-800 font-mono">
                      {selectedLocation.latitude.toFixed(6)}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Longitude:</span>
                    <span className="ml-2 text-green-800 font-mono">
                      {selectedLocation.longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    <Navigation className="h-3 w-3 mr-1" />
                    GPS Coordinates Saved
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInGoogleMaps}
                    className="text-green-700 border-green-300 hover:bg-green-50"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-2">📍 Location Tips:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• <strong>Current Location:</strong> Best for properties you're currently at</li>
            <li>• <strong>Subcity Center:</strong> Good starting point for your area</li>
            <li>• <strong>Manual Entry:</strong> Most precise if you know exact coordinates</li>
            <li>• <strong>Google Maps:</strong> You can find coordinates by right-clicking on Google Maps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationPicker;