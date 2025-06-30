import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MasonryGrid from '../components/gallery/MasonryGrid';
import Lightbox from '../components/gallery/Lightbox';
import GallerySearch from '../components/gallery/GallerySearch';
import WhatsAppContact from '../components/gallery/WhatsAppContact';
import { galleryService, GalleryImage, SearchFilters } from '../services/galleryService';
import { Loader2, Images } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightbox] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    sortBy: 'newest'
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch gallery images with filters
  const {
    data: images = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['gallery-images', searchFilters],
    queryFn: () => galleryService.getGalleryImages(searchFilters)
  });

  // Fetch available tags for search filters
  const {
    data: tags = []
  } = useQuery({
    queryKey: ['gallery-tags'],
    queryFn: () => galleryService.getAllTags()
  });
  useEffect(() => {
    setAvailableTags(tags);
  }, [tags]);
  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsLightbox(true);
  };
  const handleCloseLightbox = () => {
    setIsLightbox(false);
    setSelectedImage(null);
  };
  const handleNextImage = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedImage(images[nextIndex]);
    }
  };
  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedImage(images[prevIndex]);
    }
  };
  const handleImageSelect = (index: number) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };
  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };
  if (error) {
    return <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-cpscs-light flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Gallery</h2>
            <p className="text-gray-600 mb-4">Please try again later.</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-cpscs-blue text-white rounded hover:bg-blue-700">
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Images className="h-16 w-16 text-cpscs-blue" />
            </div>
            <h1 className="text-4xl font-bold text-cpscs-blue mb-4 md:text-4xl">
              Alumni Gallery
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-base">
              Celebrating memories, achievements, and the vibrant community of 
              Cantonment Public School and College, Saidpur alumni.
            </p>
          </div>

          {/* Search and Filter Section */}
          <GallerySearch onFiltersChange={handleFiltersChange} availableTags={availableTags} imageCount={images.length} />

          {/* Loading State */}
          {isLoading && <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-cpscs-blue mx-auto mb-4" />
                <span className="text-lg text-gray-600">Loading gallery...</span>
                <p className="text-sm text-gray-500 mt-2">Preparing your memories</p>
              </div>
            </div>}

          {/* Gallery Grid */}
          {!isLoading && images.length > 0 && <div className="mb-16">
              <MasonryGrid images={images} onImageClick={handleImageClick} />
            </div>}

          {/* Empty State */}
          {!isLoading && images.length === 0 && <div className="text-center py-20">
              <Images className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <p className="text-lg text-gray-600 mb-2">No images found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>}

          {/* WhatsApp Contact Section */}
          <WhatsAppContact />
        </div>
      </div>

      {/* Enhanced Lightbox */}
      {selectedImage && <Lightbox image={selectedImage} images={images} currentIndex={currentIndex} isOpen={isLightboxOpen} onClose={handleCloseLightbox} onNext={handleNextImage} onPrevious={handlePreviousImage} onImageSelect={handleImageSelect} />}
      
      <Footer />
    </div>
  );
};

export default Gallery;
