
import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  twinkleSpeed: number;
  isTwinkling: boolean;
}

const TwinklingStars = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Array<{id1: number, id2: number, opacity: number}>>([]);

  useEffect(() => {
    // Generate stars
    const newStars: Star[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
      twinkleSpeed: 2000 + Math.random() * 3000,
      isTwinkling: false
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const intervals = stars.map(star => {
      return setInterval(() => {
        setStars(prevStars => 
          prevStars.map(s => 
            s.id === star.id 
              ? { ...s, isTwinkling: !s.isTwinkling }
              : s
          )
        );

        // Create temporary connections when twinkling
        if (Math.random() < 0.3) {
          const nearbyStars = stars.filter(s => 
            s.id !== star.id && 
            Math.abs(s.x - star.x) < 20 && 
            Math.abs(s.y - star.y) < 20
          );
          
          if (nearbyStars.length > 0) {
            const targetStar = nearbyStars[Math.floor(Math.random() * nearbyStars.length)];
            const connectionId = `${star.id}-${targetStar.id}`;
            
            setConnections(prev => [
              ...prev.filter(c => c.id1 !== star.id && c.id2 !== star.id),
              { id1: star.id, id2: targetStar.id, opacity: 0.3 }
            ]);

            setTimeout(() => {
              setConnections(prev => prev.filter(c => !(c.id1 === star.id && c.id2 === targetStar.id)));
            }, 1000);
          }
        }
      }, star.twinkleSpeed);
    });

    return () => intervals.forEach(clearInterval);
  }, [stars]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-all duration-500"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.isTwinkling ? 1 : star.opacity,
            transform: star.isTwinkling ? 'scale(1.5)' : 'scale(1)',
            boxShadow: star.isTwinkling ? `0 0 10px rgba(255,255,255,0.8)` : 'none'
          }}
        />
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(connection => {
          const star1 = stars.find(s => s.id === connection.id1);
          const star2 = stars.find(s => s.id === connection.id2);
          if (!star1 || !star2) return null;

          return (
            <line
              key={`${connection.id1}-${connection.id2}`}
              x1={`${star1.x}%`}
              y1={`${star1.y}%`}
              x2={`${star2.x}%`}
              y2={`${star2.y}%`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeDasharray="2,3"
              style={{
                opacity: connection.opacity,
                animation: 'dashMove 2s linear infinite'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default TwinklingStars;
