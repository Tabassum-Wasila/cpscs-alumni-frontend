
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { galleryService, GalleryImage } from '@/services/galleryService';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AlumniGallerySlider: React.FC = () => {
  const [landscapeImages, setLandscapeImages] = useState<GalleryImage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Fetch gallery images
  const { data: allImages = [], isLoading } = useQuery({
    queryKey: ['gallery-images-ticker'],
    queryFn: () => galleryService.getGalleryImages({ sortBy: 'newest' }),
  });

  // Filter and prepare landscape images for ticker
  useEffect(() => {
    if (allImages.length > 0) {
      console.log('Total images:', allImages.length);
      
      // Filter landscape images with stricter criteria
      const filtered = allImages.filter(image => {
        const aspectRatio = image.width / image.height;
        const isLandscape = aspectRatio > 1.2; // More strict landscape requirement
        console.log(`Image ${image.id}: ${image.width}x${image.height}, ratio: ${aspectRatio.toFixed(2)}, isLandscape: ${isLandscape}`);
        return isLandscape;
      });
      
      console.log('Filtered landscape images:', filtered.length);
      
      if (filtered.length > 0) {
        // Shuffle the array
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Duplicate images for seamless loop (need at least 2 sets for smooth infinite scroll)
        const duplicatedImages = [...shuffled, ...shuffled, ...shuffled];
        setLandscapeImages(duplicatedImages);
      } else {
        // Fallback: use all images if no landscapes found
        console.log('No landscape images found, using all images as fallback');
        const duplicatedImages = [...allImages, ...allImages, ...allImages];
        setLandscapeImages(duplicatedImages);
      }
    }
  }, [allImages]);

  const handleGalleryNavigation = () => {
    navigate('/gallery');
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-64 mx-auto mb-6"></div>
            <div className="h-40 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (landscapeImages.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cpscs-blue mb-3">
            Memories in Motion
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            A flowing showcase of our vibrant alumni community's cherished moments
          </p>
        </div>

        {/* Image Ticker Container */}
        <div className="relative mb-8">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none"></div>
          
          {/* Film strip perforations */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-800 opacity-10 z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800 opacity-10 z-10"></div>
          
          {/* Ticker Container */}
          <div 
            className="relative h-48 overflow-hidden bg-black/5 rounded-lg"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className={`flex h-full animate-scroll-left ${isPaused ? '[animation-play-state:paused]' : ''}`}
              style={{
                width: `${landscapeImages.length * 300}px`, // 300px per image
              }}
            >
              {landscapeImages.map((image, index) => (
                <div 
                  key={`${image.id}-${index}`}
                  className="flex-shrink-0 w-72 h-full mx-1 relative group cursor-pointer"
                  onClick={() => navigate('/gallery')}
                >
                  <div className="relative h-full overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    
                    {/* Caption overlay */}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium truncate">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Navigation Button */}
        <div className="text-center">
          <Button
            onClick={handleGalleryNavigation}
            className="bg-cpscs-blue hover:bg-cpscs-blue/90 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Images className="w-5 h-5 mr-2" />
            See the Gallery
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Explore {Math.floor(landscapeImages.length / 3)} memories from our alumni community
          </p>
        </div>
      </div>
    </section>
  );
};

export default AlumniGallerySlider;
