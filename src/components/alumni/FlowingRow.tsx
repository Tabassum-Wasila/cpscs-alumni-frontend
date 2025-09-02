import React from 'react';
import AlumniCard from './AlumniCard';
import { FeaturedAlumni } from '@/services/homeAlumniService';

interface FlowingRowProps {
  alumni: FeaturedAlumni[];
  direction: 'left' | 'right';
  className?: string;
}

const FlowingRow = ({ alumni, direction, className = '' }: FlowingRowProps) => {
  // Duplicate the alumni array to create seamless loop
  const duplicatedAlumni = [...alumni, ...alumni];
  
  // Animation classes based on direction
  const animationClass = direction === 'left' 
    ? 'animate-flow-left' 
    : 'animate-flow-right';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Flowing content */}
      <div className={`flex gap-6 ${animationClass} group-hover:pause`}>
        {duplicatedAlumni.map((alumni, index) => (
          <AlumniCard 
            key={`${alumni.id}-${index}`}
            alumni={alumni}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowingRow;