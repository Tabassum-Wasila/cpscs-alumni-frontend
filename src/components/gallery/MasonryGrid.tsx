
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GalleryImage } from '@/services/galleryService';
import ImageCard from './ImageCard';

interface MasonryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images, onImageClick }) => {
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1280) setColumns(4);
      else setColumns(5);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Load initial images
  useEffect(() => {
    setVisibleImages(images.slice(0, 20));
  }, [images]);

  // Infinite scroll implementation
  const lastImageRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleImages.length < images.length) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleImages(prev => [
            ...prev,
            ...images.slice(prev.length, prev.length + 10)
          ]);
          setIsLoading(false);
        }, 300);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, visibleImages.length, images.length]);

  // Distribute images across columns for balanced layout
  const distributeImages = () => {
    const columnHeights = new Array(columns).fill(0);
    const columnImages: GalleryImage[][] = Array.from({ length: columns }, () => []);

    visibleImages.forEach((image) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      columnImages[shortestColumn].push(image);
      // Estimate height based on aspect ratio for better distribution
      const aspectRatio = image.height / image.width;
      columnHeights[shortestColumn] += aspectRatio * 300 + 20; // Base width 300px + gap
    });

    return columnImages;
  };

  const columnImages = distributeImages();

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className="grid gap-4 auto-rows-max"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {columnImages.map((columnItems, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {columnItems.map((image, imageIndex) => {
              const globalIndex = visibleImages.indexOf(image);
              const isLast = globalIndex === visibleImages.length - 1;
              
              return (
                <div 
                  key={image.id}
                  ref={isLast ? lastImageRef : null}
                  className="animate-fade-in"
                  style={{ animationDelay: `${globalIndex * 50}ms` }}
                >
                  <ImageCard 
                    image={image} 
                    onClick={() => onImageClick(image, globalIndex)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cpscs-blue"></div>
          <span className="ml-3 text-gray-600">Loading more images...</span>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
