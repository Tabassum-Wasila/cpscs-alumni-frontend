
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import TwinklingStars from './TwinklingStars';
import SolarSystem from './goals/SolarSystem';

const GoalsSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 overflow-hidden relative">
      {/* Enhanced twinkling stars background */}
      <TwinklingStars />

      {/* Enhanced galaxy nebula effects with more visible gradients */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 ${isMobile ? 'w-48 h-48' : 'w-96 h-96'} bg-purple-600/20 rounded-full ${isMobile ? 'blur-xl' : 'blur-3xl'} animate-pulse`} />
        <div className={`absolute bottom-1/4 right-1/4 ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} bg-blue-600/20 rounded-full ${isMobile ? 'blur-xl' : 'blur-3xl'} animate-pulse`} />
        <div className={`absolute top-1/2 left-1/2 ${isMobile ? 'w-32 h-32' : 'w-64 h-64'} bg-indigo-600/20 rounded-full ${isMobile ? 'blur-lg' : 'blur-2xl'} transform -translate-x-1/2 -translate-y-1/2 animate-pulse`} />
        <div className={`absolute top-1/3 right-1/3 ${isMobile ? 'w-24 h-24' : 'w-48 h-48'} bg-pink-600/15 rounded-full ${isMobile ? 'blur-lg' : 'blur-2xl'} animate-pulse`} />
        <div className={`absolute bottom-1/3 left-1/3 ${isMobile ? 'w-28 h-28' : 'w-56 h-56'} bg-cyan-600/15 rounded-full ${isMobile ? 'blur-lg' : 'blur-2xl'} animate-pulse`} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6 leading-tight`}>
            Our Goals
          </h2>
          <p className={`text-gray-300 ${isMobile ? 'text-lg' : 'text-xl'} font-light max-w-2xl mx-auto`}>
            Like planets in our alumni solar system, each goal orbits around our central mission.
          </p>
        </div>

        {/* Interactive Solar System */}
        <SolarSystem />

        {/* Interactive Instructions */}
        <div className="text-center mt-12">
          <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Each alumni member is a star in our galaxy, connecting through dotted lines.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
