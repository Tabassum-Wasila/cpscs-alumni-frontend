
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
    // Generate stars with better distribution and larger size
    const newStars: Star[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.3,
      size: 1.5 + Math.random() * 1.5, // Increased from 0.8-2 to 1.5-3
      twinkleSpeed: 3000 + Math.random() * 4000,
      isTwinkling: false,
      lastTwinkle: 0
    }));
    setStars(newStars);
  }, []);

  // Background gradient breathing animation
  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setBackgroundPhase(prev => (prev + 0.008) % (Math.PI * 2)); // Slower phase change
    }, 100);

    return () => clearInterval(gradientInterval);
  }, []);

  // Select random stars for network connections (no distance limitation)
  const selectNetworkStars = (currentStar: Star, allStars: Star[]) => {
    const otherStars = allStars.filter(s => s.id !== currentStar.id);
    const connectionCount = 3 + Math.floor(Math.random() * 3); // 3-5 connections
    
    // Shuffle and select random stars for variety
    const shuffled = [...otherStars].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, connectionCount);
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

        // ALWAYS create connections when star starts twinkling
        if (Math.random() < 0.7) { // 70% chance to create network connections
          const networkStars = selectNetworkStars(star, stars);
          
          if (networkStars.length > 0) {
            const newConnections = networkStars.map(targetStar => ({
              id1: star.id,
              id2: targetStar.id,
              opacity: 0,
              createdAt: now
            }));

            setConnections(prev => [
              ...prev.filter(c => c.id1 !== star.id && c.id2 !== star.id),
              ...newConnections
            ]);

            // Animate connection opacity - make it more visible
            setTimeout(() => {
              setConnections(prev => prev.map(c => 
                newConnections.some(nc => nc.id1 === c.id1 && nc.id2 === c.id2)
                  ? { ...c, opacity: 0.25 } // Increased from 0.15 to 0.25
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

  // Generate dynamic gradient colors based on phase with slower, more subtle changes
  const getGradientStyle = () => {
    const phase1 = Math.sin(backgroundPhase) * 0.2 + 0.8; // Reduced variation
    const phase2 = Math.sin(backgroundPhase + Math.PI / 2) * 0.2 + 0.8;
    const phase3 = Math.sin(backgroundPhase + Math.PI) * 0.2 + 0.8;
    
    return {
      background: `radial-gradient(circle at 25% 25%, rgba(79, 70, 229, ${phase1 * 0.08}) 0%, transparent 50%), 
                   radial-gradient(circle at 75% 50%, rgba(147, 51, 234, ${phase2 * 0.06}) 0%, transparent 50%), 
                   radial-gradient(circle at 50% 75%, rgba(59, 130, 246, ${phase3 * 0.04}) 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, rgba(168, 85, 247, ${phase1 * 0.05}) 0%, transparent 60%)`
    };
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced breathing gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-2000 ease-in-out"
        style={getGradientStyle()}
      />

      {/* Star-shaped elements with improved visibility */}
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

      {/* Enhanced dynamic connection network */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(connection => {
          const star1 = stars.find(s => s.id === connection.id1);
          const star2 = stars.find(s => s.id === connection.id2);
          if (!star1 || !star2) return null;

          const x1 = (star1.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
          const y1 = (star1.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);
          const x2 = (star2.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
          const y2 = (star2.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);

          return (
            <line
              key={`${connection.id1}-${connection.id2}-${connection.createdAt}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              strokeDasharray="3,6"
              style={{
                opacity: connection.opacity,
                animation: 'connectionPulse 3s ease-in-out infinite, dashMove 4s linear infinite',
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default TwinklingStars;
