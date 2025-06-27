
import React from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  isTwinkling: boolean;
}

interface StarFieldProps {
  stars: Star[];
}

const StarField: React.FC<StarFieldProps> = ({ stars }) => {
  return (
    <>
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute transition-all duration-700 ease-in-out alumni-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            transform: `translate(-50%, -50%) scale(${star.isTwinkling ? 1.8 : 1})`,
            opacity: star.isTwinkling ? 1 : star.opacity,
            filter: star.isTwinkling ? 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' : 'none',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            backgroundColor: 'white',
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </>
  );
};

export default StarField;
