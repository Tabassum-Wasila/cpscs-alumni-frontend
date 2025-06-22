
import React, { useState } from 'react';
import { GalleryImage } from '@/services/galleryService';

interface ImageCardProps {
  image: GalleryImage;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100"
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="animate-pulse bg-gray-300 w-full h-64"></div>
      )}

      {/* Image */}
      {!hasError ? (
        <img
          src={image.url}
          alt={image.alt}
          className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500">
          <span>Image unavailable</span>
        </div>
      )}

      {/* Overlay with caption */}
      {image.caption && isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-sm font-medium">{image.caption}</p>
            {image.uploadDate && (
              <p className="text-xs opacity-75 mt-1">
                {new Date(image.uploadDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ImageCard;
