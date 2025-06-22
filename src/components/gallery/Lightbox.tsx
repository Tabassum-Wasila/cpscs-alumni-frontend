
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryImage } from '@/services/galleryService';
import FilmStrip from './FilmStrip';

interface LightboxProps {
  image: GalleryImage;
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onImageSelect?: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  image,
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onImageSelect,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Preload adjacent images for smooth navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const preloadImages = [];
    if (currentIndex > 0) preloadImages.push(images[currentIndex - 1]);
    if (currentIndex < images.length - 1) preloadImages.push(images[currentIndex + 1]);
    
    preloadImages.forEach(img => {
      const preload = new Image();
      preload.src = img.url;
    });
  }, [currentIndex, images, isOpen]);

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsLoading(true);
  }, [currentIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) onNext();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) onPrevious();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
    }
  }, [isOpen, currentIndex, images.length, onClose, onNext, onPrevious]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { 
      x: touch.clientX, 
      y: touch.clientY, 
      time: Date.now() 
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const touchEnd = { x: touch.clientX, y: touch.clientY };
    const touchStart = touchStartRef.current;
    const timeDiff = Date.now() - touchStart.time;
    
    // Only handle swipe if it's quick and primarily horizontal
    if (timeDiff < 300) {
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = Math.abs(touchEnd.y - touchStart.y);
      
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0 && currentIndex > 0) {
          onPrevious();
        } else if (deltaX < 0 && currentIndex < images.length - 1) {
          onNext();
        }
      }
    }
  };

  // Zoom functionality
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 1));

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.caption || 'CPSCS Alumni Gallery',
          text: image.alt,
          url: image.url,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.url);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `cpscs-gallery-${image.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageSelect = (index: number) => {
    if (onImageSelect) {
      onImageSelect(index);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 bg-black/30"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 bg-black/30"
          onClick={handleDownload}
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 bg-black/30"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 bg-black/30"
          onClick={handleZoomIn}
          disabled={zoom >= 4}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 bg-black/30"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 bg-black/30 h-12 w-12"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {currentIndex < images.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 bg-black/30 h-12 w-12"
          onClick={onNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Image container */}
      <div 
        className="flex items-center justify-center w-full h-full p-4 md:p-8 pb-24"
        onClick={zoom <= 1 ? onClose : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="relative max-w-full max-h-full cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          )}

          <img
            ref={imageRef}
            src={image.url}
            alt={image.alt}
            className={`max-w-full max-h-full object-contain transition-all duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: 'center center'
            }}
            onLoad={() => setIsLoading(false)}
            draggable={false}
          />
          
          {/* Image info */}
          {(image.caption || image.uploadDate) && !isLoading && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              {image.caption && (
                <h3 className="text-lg font-medium mb-1">{image.caption}</h3>
              )}
              {image.uploadDate && (
                <p className="text-sm opacity-75">
                  {new Date(image.uploadDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-xs opacity-60 mt-2">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Film Strip Navigation */}
      <FilmStrip
        images={images}
        currentIndex={currentIndex}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};

export default Lightbox;
