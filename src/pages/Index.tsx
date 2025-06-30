
import React from 'react';
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

const Index = () => {
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
      <Footer />
    </div>
  );
};

export default Index;
