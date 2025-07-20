
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';
import SocialFeed from '../components/social/SocialFeed';
import { BookOpen, Users, Heart, TrendingUp } from 'lucide-react';

const Blog = () => {
  const location = useLocation();
  
  // Fetch banner data based on current path
  const { data: bannerResponse, isLoading: bannerLoading } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cpscs-light via-white to-cpscs-light/50">
      <Navbar />
      
      <div className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cpscs-blue to-cpscs-blue/90 text-white py-12 mb-0">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-12 w-12 text-cpscs-gold" />
              <h1 className="text-4xl md:text-5xl font-bold">
                CPSCS Magazine
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6 leading-relaxed">
              Share your stories, achievements, and memories with fellow CPSCS alumni. 
              Our social magazine connects generations through shared experiences.
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-cpscs-gold mb-1">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <div className="text-sm text-blue-200">Active Alumni</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-cpscs-gold mb-1">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-2xl font-bold">1.2K</span>
                </div>
                <div className="text-sm text-blue-200">Stories Shared</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-cpscs-gold mb-1">
                  <Heart className="h-5 w-5" />
                  <span className="text-2xl font-bold">15K</span>
                </div>
                <div className="text-sm text-blue-200">Community Loves</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-cpscs-gold mb-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <div className="text-sm text-blue-200">Engagement Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Feed */}
        <SocialFeed />
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

export default Blog;
