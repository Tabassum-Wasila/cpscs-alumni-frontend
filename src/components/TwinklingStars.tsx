
import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  twinkleSpeed: number;
  isTwinkling: boolean;
  lastTwinkle: number;
}

interface Connection {
  id1: number;
  id2: number;
  opacity: number;
  createdAt: number;
}

const TwinklingStars = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [backgroundPhase, setBackgroundPhase] = useState(0);

  useEffect(() => {
    // Generate stars with better distribution
    const newStars: Star[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.3,
      size: 0.8 + Math.random() * 1.2, // Smaller, more distant
      twinkleSpeed: 3000 + Math.random() * 4000, // Slower
      isTwinkling: false,
      lastTwinkle: 0
    }));
    setStars(newStars);
  }, []);

  // Background gradient breathing animation
  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setBackgroundPhase(prev => (prev + 0.01) % (Math.PI * 2));
    }, 100);

    return () => clearInterval(gradientInterval);
  }, []);

  // Find nearby stars for connections
  const findNearbyStars = (star: Star, allStars: Star[]) => {
    return allStars
      .filter(s => s.id !== star.id)
      .map(s => ({
        star: s,
        distance: Math.sqrt(Math.pow(s.x - star.x, 2) + Math.pow(s.y - star.y, 2))
      }))
      .filter(({ distance }) => distance < 25) // Only nearby stars
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2) // Max 2 connections per star
      .map(({ star }) => star);
  };

  useEffect(() => {
    const intervals = stars.map(star => {
      return setInterval(() => {
        const now = Date.now();
        
        setStars(prevStars => 
          prevStars.map(s => 
            s.id === star.id 
              ? { ...s, isTwinkling: !s.isTwinkling, lastTwinkle: now }
              : s
          )
        );

        // Create connections when star starts twinkling
        if (Math.random() < 0.4) { // 40% chance to create connections
          const nearbyStars = findNearbyStars(star, stars);
          
          if (nearbyStars.length > 0) {
            const newConnections = nearbyStars.map(targetStar => ({
              id1: star.id,
              id2: targetStar.id,
              opacity: 0,
              createdAt: now
            }));

            setConnections(prev => [
              ...prev.filter(c => c.id1 !== star.id && c.id2 !== star.id),
              ...newConnections
            ]);

            // Animate connection opacity
            setTimeout(() => {
              setConnections(prev => prev.map(c => 
                newConnections.some(nc => nc.id1 === c.id1 && nc.id2 === c.id2)
                  ? { ...c, opacity: 0.15 }
                  : c
              ));
            }, 50);

            // Remove connections after animation
            setTimeout(() => {
              setConnections(prev => prev.filter(c => 
                !newConnections.some(nc => nc.id1 === c.id1 && nc.id2 === c.id2)
              ));
            }, 2500);
          }
        }
      }, star.twinkleSpeed);
    });

    return () => intervals.forEach(clearInterval);
  }, [stars]);

  // Clean up old connections
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setConnections(prev => prev.filter(c => now - c.createdAt < 3000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  // Generate dynamic gradient colors based on phase
  const getGradientStyle = () => {
    const phase1 = Math.sin(backgroundPhase) * 0.3 + 0.7;
    const phase2 = Math.sin(backgroundPhase + Math.PI / 3) * 0.3 + 0.7;
    const phase3 = Math.sin(backgroundPhase + Math.PI * 2 / 3) * 0.3 + 0.7;
    
    return {
      background: `radial-gradient(circle at 30% 20%, rgba(79, 70, 229, ${phase1 * 0.1}) 0%, transparent 50%), 
                   radial-gradient(circle at 70% 60%, rgba(147, 51, 234, ${phase2 * 0.08}) 0%, transparent 50%), 
                   radial-gradient(circle at 50% 80%, rgba(59, 130, 246, ${phase3 * 0.06}) 0%, transparent 50%)`
    };
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Breathing gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={getGradientStyle()}
      />

      {/* Star-shaped elements */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute transition-all duration-700 ease-in-out"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            transform: `translate(-50%, -50%) scale(${star.isTwinkling ? 1.8 : 1})`,
            opacity: star.isTwinkling ? 1 : star.opacity,
            filter: star.isTwinkling ? 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' : 'none',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            backgroundColor: 'white',
            willChange: 'transform, opacity'
          }}
        />
      ))}

      {/* Dynamic connection network */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(connection => {
          const star1 = stars.find(s => s.id === connection.id1);
          const star2 = stars.find(s => s.id === connection.id2);
          if (!star1 || !star2) return null;

          const x1 = (star1.x / 100) * window.innerWidth;
          const y1 = (star1.y / 100) * window.innerHeight;
          const x2 = (star2.x / 100) * window.innerWidth;
          const y2 = (star2.y / 100) * window.innerHeight;

          return (
            <line
              key={`${connection.id1}-${connection.id2}-${connection.createdAt}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              strokeDasharray="1,2"
              style={{
                opacity: connection.opacity,
                animation: 'dashMove 3s linear infinite',
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default TwinklingStars;
