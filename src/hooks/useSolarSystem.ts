
import { useState, useEffect, useMemo, useCallback } from 'react';
import { GoalData } from '../data/goalsData';

export const useSolarSystem = (goals: GoalData[], isMobile: boolean) => {
  const [animationTime, setAnimationTime] = useState(0);

  const containerSize = useMemo(() => 640 * (isMobile ? 0.5 : 1), [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + (isMobile ? 0.003 : 0.005));
    }, isMobile ? 20 : 16);

    return () => clearInterval(interval);
  }, [isMobile]);

  const getPlanetPosition = useCallback((goal: GoalData) => {
    const angle = goal.position.angle + animationTime * goal.speed;
    const x = Math.cos(angle) * goal.orbitRadius;
    const y = Math.sin(angle) * goal.orbitRadius * 0.6;
    return { x, y, angle };
  }, [animationTime]);

  return {
    containerSize,
    getPlanetPosition
  };
};
