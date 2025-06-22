
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
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);
  const BATCH_SIZE = 20;

  // Responsive column calculation with better breakpoints
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);           // mobile
      else if (width < 768) setColumns(2);      // tablet portrait
      else if (width < 1024) setColumns(3);     // tablet landscape
      else if (width < 1280) setColumns(4);     // small desktop
      else if (width < 1536) setColumns(5);     // large desktop
      else setColumns(6);                       // extra large
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Initialize with first batch
  useEffect(() => {
    const initialBatch = images.slice(0, BATCH_SIZE);
    setVisibleImages(initialBatch);
    setHasMore(images.length > BATCH_SIZE);
  }, [images]);

  // Enhanced infinite scroll with performance optimization
  const lastImageRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          
          // Simulate network delay for smooth UX
          setTimeout(() => {
            const currentLength = visibleImages.length;
            const nextBatch = images.slice(currentLength, currentLength + BATCH_SIZE);
            
            if (nextBatch.length > 0) {
              setVisibleImages(prev => [...prev, ...nextBatch]);
              setHasMore(currentLength + nextBatch.length < images.length);
            } else {
              setHasMore(false);
            }
            
            setIsLoading(false);
          }, 300);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading before reaching the end
      }
    );
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, visibleImages.length, images]);

  // Smart image distribution algorithm for better visual balance
  const distributeImages = () => {
    const columnHeights = new Array(columns).fill(0);
    const columnImages: GalleryImage[][] = Array.from({ length: columns }, () => []);

    visibleImages.forEach((image) => {
      // Find column with minimum height
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columnImages[shortestColumnIndex].push(image);
      
      // Estimate height more accurately based on actual aspect ratio
      const aspectRatio = image.height / image.width;
      const estimatedHeight = aspectRatio * 280 + 40; // Base card width + margin
      columnHeights[shortestColumnIndex] += estimatedHeight;
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
                  className="animate-fade-in opacity-0"
                  style={{ 
                    animationDelay: `${globalIndex * 50}ms`,
                    animationFillMode: 'forwards'
                  }}
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

      {/* Enhanced loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-cpscs-blue border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full h-10 w-10 border-4 border-gray-200"></div>
            </div>
            <span className="text-gray-600 font-medium">Loading more memories...</span>
          </div>
        </div>
      )}

      {/* No more images indicator */}
      {!hasMore && visibleImages.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-block px-6 py-3 bg-gray-100 rounded-full">
            <span className="text-gray-600 font-medium">
              You've reached the end! {visibleImages.length} memories loaded.
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && visibleImages.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Camera className="h-16 w-16 mx-auto mb-4" />
          </div>
          <p className="text-lg text-gray-600 mb-2">No photos match your search</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
