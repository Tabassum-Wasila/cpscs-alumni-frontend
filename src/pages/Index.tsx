
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import AboutSection from '../components/AboutSection';
import EventsSection from '../components/EventsSection';
import FeaturedAlumni from '../components/FeaturedAlumni';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsSection />
      <AboutSection />
      <EventsSection />
      <FeaturedAlumni />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
