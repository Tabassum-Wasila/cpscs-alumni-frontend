
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
}

interface Connection {
  id1: number;
  id2: number;
  opacity: number;
  createdAt: number;
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
      lastTwinkle: 0
    }));
    setStars(newStars);
  }, []);

  const selectNetworkStars = useCallback((currentStar: Star, allStars: Star[]) => {
    const otherStars = allStars.filter(s => s.id !== currentStar.id);
    const connectionCount = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...otherStars].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, connectionCount);
  }, []);

  const createConnections = useCallback((star: Star, networkStars: Star[]) => {
    const now = Date.now();
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

    setTimeout(() => {
      setConnections(prev => prev.map(c => 
        newConnections.some(nc => nc.id1 === c.id1 && nc.id2 === c.id2)
          ? { ...c, opacity: 0.3 }
          : c
      ));
    }, 50);

    setTimeout(() => {
      setConnections(prev => prev.filter(c => 
        !newConnections.some(nc => nc.id1 === c.id1 && nc.id2 === c.id2)
      ));
    }, 2500);
  }, []);

  // Group twinkling effect
  useEffect(() => {
    const groupTwinkleInterval = setInterval(() => {
      const numberOfStars = 3 + Math.floor(Math.random() * 3);
      const selectedStars = [...stars]
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfStars);

      selectedStars.forEach(star => {
        const now = Date.now();
        
        setStars(prevStars => 
          prevStars.map(s => 
            s.id === star.id 
              ? { ...s, isTwinkling: true, lastTwinkle: now }
              : s
          )
        );

        const networkStars = selectNetworkStars(star, stars);
        if (networkStars.length > 0) {
          createConnections(star, networkStars);
        }

        setTimeout(() => {
          setStars(prevStars => 
            prevStars.map(s => 
              s.id === star.id 
                ? { ...s, isTwinkling: false }
                : s
            )
          );
        }, 700);
      });
    }, 2000);

    return () => clearInterval(groupTwinkleInterval);
  }, [stars, selectNetworkStars, createConnections]);

  // Individual star twinkling
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

        if (Math.random() < 0.2) {
          const networkStars = selectNetworkStars(star, stars);
          if (networkStars.length > 0) {
            createConnections(star, networkStars);
          }
        }
      }, star.twinkleSpeed);
    });

    return () => intervals.forEach(clearInterval);
  }, [stars, selectNetworkStars, createConnections]);

  // Cleanup old connections
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setConnections(prev => prev.filter(c => now - c.createdAt < 3000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return { stars, connections };
};
