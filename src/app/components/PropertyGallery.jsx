import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function PropertyGallery({ images = [], title = 'Property' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Handle case where images might be objects with url property or just strings
  const imageUrls = images.map(img => 
    typeof img === 'object' ? img.url : img
  ).filter(Boolean);

  if (!imageUrls.length) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🏠</div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const openFullscreen = (index) => {
    setCurrentImageIndex(index);
    setShowFullscreen(true);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative h-96 rounded-lg overflow-hidden group">
          <img 
            src={imageUrls[currentImageIndex]} 
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openFullscreen(currentImageIndex)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
            }}
          />
          
          {/* Navigation Arrows */}
          {imageUrls.length > 1 && (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {imageUrls.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {imageUrls.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                  index === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
                  }}
                />
                {index === 5 && imageUrls.length > 6 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                    +{imageUrls.length - 6}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 z-10"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation */}
            {imageUrls.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <img 
              src={imageUrls[currentImageIndex]} 
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center';
              }}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyGallery;