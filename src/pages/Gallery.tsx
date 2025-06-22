
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MasonryGrid from '../components/gallery/MasonryGrid';
import Lightbox from '../components/gallery/Lightbox';
import { galleryService, GalleryImage } from '../services/galleryService';
import { Loader2 } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightbox] = useState(false);

  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => galleryService.getGalleryImages(),
  });

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-cpscs-light flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Gallery</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cpscs-blue mb-4">
              Alumni Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrating memories, achievements, and the vibrant community of 
              Cantonment Public School and College, Saidpur alumni.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-cpscs-blue mr-3" />
              <span className="text-lg text-gray-600">Loading gallery...</span>
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && images.length > 0 && (
            <MasonryGrid 
              images={images} 
              onImageClick={handleImageClick}
            />
          )}

          {/* Empty State */}
          {!isLoading && images.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600">No images available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          images={images}
          currentIndex={currentIndex}
          isOpen={isLightboxOpen}
          onClose={handleCloseLightbox}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Gallery;
