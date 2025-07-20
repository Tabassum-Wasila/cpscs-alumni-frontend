
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InteractiveStatsSection from '../components/InteractiveStatsSection';
import AboutSection from '../components/AboutSection';
import AlumniGallerySlider from '../components/AlumniGallerySlider';
import GoalsSection from '../components/GoalsSection';
import EventsSection from '../components/EventsSection';
import FeaturedAlumni from '../components/FeaturedAlumni';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';

const Index = () => {
  const location = useLocation();
  
  // Fetch banner data based on current path
  const { data: bannerResponse, isLoading: bannerLoading } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Mobile top spacing to prevent navbar overlap - increased for proper clearance */}
      <div className="lg:hidden pt-40"></div>
      <Hero />
      <InteractiveStatsSection />
      <AboutSection />
      <AlumniGallerySlider />
      <GoalsSection />
      <EventsSection />
      <FeaturedAlumni />
      <CallToAction />
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner 
        bannerData={bannerResponse?.banner || null} 
        isLoading={bannerLoading}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
