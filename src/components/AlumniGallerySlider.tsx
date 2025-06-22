
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { galleryService, GalleryImage } from '@/services/galleryService';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const AlumniGallerySlider: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [landscapeImages, setLandscapeImages] = useState<GalleryImage[]>([]);

  // Fetch gallery images
  const { data: allImages = [], isLoading } = useQuery({
    queryKey: ['gallery-images-slider'],
    queryFn: () => galleryService.getGalleryImages({ sortBy: 'newest' }),
  });

  // Filter and randomize landscape images
  useEffect(() => {
    if (allImages.length > 0) {
      const filtered = allImages.filter(image => image.width > image.height);
      // Randomize array using Fisher-Yates shuffle
      const shuffled = [...filtered];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setLandscapeImages(shuffled);
    }
  }, [allImages]);

  // Configure autoplay
  const autoplay = React.useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true 
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      skipSnaps: false,
      dragFree: false
    },
    [autoplay.current]
  );

  // Handle play/pause
  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;
    
    if (isPaused) {
      autoplay.current.play();
      setIsPaused(false);
    } else {
      autoplay.current.stop();
      setIsPaused(true);
    }
  }, [emblaApi, isPaused]);

  // Track current slide
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  // Manual navigation
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (landscapeImages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-cpscs-blue mb-4">
            Memories Through Time
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Journey through our vibrant alumni community's most cherished moments and achievements
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-6xl mx-auto">
          <div 
            className="overflow-hidden rounded-2xl shadow-2xl"
            ref={emblaRef}
            onMouseEnter={() => autoplay.current.stop()}
            onMouseLeave={() => !isPaused && autoplay.current.play()}
          >
            <div className="flex">
              {landscapeImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="flex-[0_0_100%] relative group"
                >
                  <div className="relative h-96 md:h-[500px] overflow-hidden">
                    {/* Ken Burns Effect Image */}
                    <div className="absolute inset-0 scale-105 group-hover:scale-110 transition-transform duration-[8000ms] ease-out">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading={index <= 2 ? 'eager' : 'lazy'}
                      />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.caption && (
                          <h3 className="text-2xl md:text-3xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            {image.caption}
                          </h3>
                        )}
                        {image.uploadDate && (
                          <p className="text-sm opacity-75 opacity-0 group-hover:opacity-75 transition-opacity duration-500 delay-300">
                            {new Date(image.uploadDate).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Play/Pause Control */}
          <button
            onClick={toggleAutoplay}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200"
            aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {landscapeImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Showcasing {landscapeImages.length} memories from our alumni community
          </p>
        </div>
      </div>
    </section>
  );
};

export default AlumniGallerySlider;
