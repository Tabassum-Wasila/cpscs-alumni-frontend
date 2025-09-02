import React from 'react';
import AlumniCard from './AlumniCard';
import { FeaturedAlumni } from '@/services/homeAlumniService';

interface FlowingRowProps {
  alumni: FeaturedAlumni[];
  direction: 'left' | 'right';
  className?: string;
}

const FlowingRow = ({ alumni, direction, className = '' }: FlowingRowProps) => {
  // Triple the alumni array for truly seamless circular flow
  const extendedAlumni = [...alumni, ...alumni, ...alumni];
  
  // Animation classes based on direction with smooth circular flow
  const animationClass = direction === 'left' 
    ? 'animate-flow-left-smooth' 
    : 'animate-flow-right-smooth';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Enhanced gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
      
      {/* Flowing content with seamless circular animation */}
      <div className={`flex gap-8 ${animationClass} hover:animation-play-state-paused`}>
        {extendedAlumni.map((alumni, index) => (
          <AlumniCard 
            key={`${alumni.id}-${index}-${direction}`}
            alumni={alumni}
            className="flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default FlowingRow;