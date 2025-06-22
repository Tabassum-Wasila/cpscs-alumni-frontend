
import React, { useRef, useEffect } from 'react';
import { GalleryImage } from '@/services/galleryService';

interface FilmStripProps {
  images: GalleryImage[];
  currentIndex: number;
  onImageSelect: (index: number) => void;
}

const FilmStrip: React.FC<FilmStripProps> = ({ images, currentIndex, onImageSelect }) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const currentThumbnailRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current image
  useEffect(() => {
    if (currentThumbnailRef.current && stripRef.current) {
      const thumbnail = currentThumbnailRef.current;
      const strip = stripRef.current;
      const stripRect = strip.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();
      
      const scrollLeft = thumbnail.offsetLeft - stripRect.width / 2 + thumbnailRect.width / 2;
      strip.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentIndex]);

  if (images.length <= 1) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
      <div
        ref={stripRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide bg-black/50 backdrop-blur-sm rounded-lg p-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={index === currentIndex ? currentThumbnailRef : null}
            className={`
              flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-200
              ${index === currentIndex 
                ? 'ring-2 ring-white scale-110 opacity-100' 
                : 'opacity-70 hover:opacity-100 hover:scale-105'
              }
            `}
            onClick={() => onImageSelect(index)}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-16 h-16 object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilmStrip;
