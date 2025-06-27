
import { useState, useEffect, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  twinkleSpeed: number;
  isTwinkling: boolean;
  lastTwinkle: number;
  cooldownUntil: number;
}

interface Connection {
  id1: number;
  id2: number;
  opacity: number;
  createdAt: number;
  delay: number;
}

export const useTwinklingLogic = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.3,
      size: 1.5 + Math.random() * 1.5,
      twinkleSpeed: 1500 + Math.random() * 2000,
      isTwinkling: false,
      lastTwinkle: 0,
      cooldownUntil: 0
    }));
    setStars(newStars);
  }, []);

  const getRandomStars = useCallback((excludeId: number, allStars: Star[], count: number) => {
    const now = Date.now();
    const availableStars = allStars.filter(s => 
      s.id !== excludeId && 
      now > s.cooldownUntil
    );
    
    // Shuffle and take the requested count
    const shuffled = [...availableStars].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, []);

  const createEnhancedConnections = useCallback((star: Star, targetStars: Star[]) => {
    const now = Date.now();
    const baseDelay = 0;
    const delayIncrement = 100;

    const newConnections = targetStars.map((targetStar, index) => ({
      id1: star.id,
      id2: targetStar.id,
      opacity: 0,
      createdAt: now,
      delay: baseDelay + (index * delayIncrement)
    }));

    setConnections(prev => [
      ...prev.filter(c => c.id1 !== star.id && c.id2 !== star.id),
      ...newConnections
    ]);

    // Animate connections with staggered timing
    newConnections.forEach((connection, index) => {
      setTimeout(() => {
        setConnections(prev => prev.map(c => 
          c.id1 === connection.id1 && c.id2 === connection.id2 && c.createdAt === connection.createdAt
            ? { ...c, opacity: 0.4 + Math.random() * 0.2 }
            : c
        ));
      }, connection.delay + 50);
    });

    // Remove connections after animation
    setTimeout(() => {
      setConnections(prev => prev.filter(c => 
        !newConnections.some(nc => 
          nc.id1 === c.id1 && nc.id2 === c.id2 && nc.createdAt === c.createdAt
        )
      ));
    }, 2800);
  }, []);

  // Enhanced group twinkling with better randomization
  useEffect(() => {
    const groupTwinkleInterval = setInterval(() => {
      const now = Date.now();
      const availableStars = stars.filter(s => now > s.cooldownUntil);
      
      if (availableStars.length === 0) return;

      // Select 2-4 random stars for group twinkling
      const numberOfStars = 2 + Math.floor(Math.random() * 3);
      const selectedStars = [...availableStars]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numberOfStars, availableStars.length));

      selectedStars.forEach((star, index) => {
        // Stagger the twinkling start times
        setTimeout(() => {
          setStars(prevStars => 
            prevStars.map(s => 
              s.id === star.id 
                ? { 
                    ...s, 
                    isTwinkling: true, 
                    lastTwinkle: now,
                    cooldownUntil: now + 3000 + Math.random() * 2000 // 3-5 second cooldown
                  }
                : s
            )
          );

          // Create 4-7 connections for each twinkling star
          const connectionCount = 4 + Math.floor(Math.random() * 4);
          const targetStars = getRandomStars(star.id, stars, connectionCount);
          
          if (targetStars.length > 0) {
            createEnhancedConnections(star, targetStars);
          }

          // Stop twinkling after animation
          setTimeout(() => {
            setStars(prevStars => 
              prevStars.map(s => 
                s.id === star.id 
                  ? { ...s, isTwinkling: false }
                  : s
              )
            );
          }, 700);
        }, index * 200); // Stagger group twinkling
      });
    }, 1800); // Slightly faster group twinkling

    return () => clearInterval(groupTwinkleInterval);
  }, [stars, getRandomStars, createEnhancedConnections]);

  // Random individual star twinkling
  useEffect(() => {
    const randomTwinkleInterval = setInterval(() => {
      const now = Date.now();
      const availableStars = stars.filter(s => now > s.cooldownUntil && !s.isTwinkling);
      
      if (availableStars.length === 0) return;

      // Randomly select 1-2 stars for individual twinkling
      const selectedCount = Math.random() < 0.7 ? 1 : 2;
      const selectedStars = [...availableStars]
        .sort(() => Math.random() - 0.5)
        .slice(0, selectedCount);

      selectedStars.forEach(star => {
        setStars(prevStars => 
          prevStars.map(s => 
            s.id === star.id 
              ? { 
                  ...s, 
                  isTwinkling: true, 
                  lastTwinkle: now,
                  cooldownUntil: now + 2500 + Math.random() * 1500
                }
              : s
          )
        );

        // Create 3-5 connections for individual twinkling
        const connectionCount = 3 + Math.floor(Math.random() * 3);
        const targetStars = getRandomStars(star.id, stars, connectionCount);
        
        if (targetStars.length > 0) {
          createEnhancedConnections(star, targetStars);
        }

        setTimeout(() => {
          setStars(prevStars => 
            prevStars.map(s => 
              s.id === star.id 
                ? { ...s, isTwinkling: false }
                : s
            )
          );
        }, 600);
      });
    }, 1200); // Random individual twinkling

    return () => clearInterval(randomTwinkleInterval);
  }, [stars, getRandomStars, createEnhancedConnections]);

  // Cleanup old connections
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setConnections(prev => prev.filter(c => now - c.createdAt < 3200));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return { stars, connections };
};
