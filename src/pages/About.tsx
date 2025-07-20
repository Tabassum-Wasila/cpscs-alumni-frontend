
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';

const About = () => {
  const location = useLocation();
  
  // Fetch banner data based on current path
  const { data: bannerResponse, isLoading: bannerLoading } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">About CPSCS Alumni Association</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              The Cantonment Public School and College, Saidpur Alumni Association connects generations of graduates, 
              fostering a strong community that celebrates our shared history and supports current students.
            </p>
            
            {/* Content to be expanded later */}
            <p className="text-gray-600 italic">More content about our mission, vision, and history coming soon...</p>
          </div>
        </div>
      </div>
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner 
        bannerData={bannerResponse?.banner || null} 
        isLoading={bannerLoading}
      />
      
      <Footer />
    </div>
  );
};

export default About;
