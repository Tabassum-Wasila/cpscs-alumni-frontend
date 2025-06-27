
import React, { useState, useMemo } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { createGoalsData } from '../../data/goalsData';
import { useSolarSystem } from '../../hooks/useSolarSystem';
import SolarSystemSun from './SolarSystemSun';
import SolarSystemPlanet from './SolarSystemPlanet';

const SolarSystem = React.memo(() => {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [hoveredSun, setHoveredSun] = useState(false);
  const isMobile = useIsMobile();

  const goals = useMemo(() => createGoalsData(isMobile), [isMobile]);
  const { containerSize, getPlanetPosition } = useSolarSystem(goals, isMobile);

  const connectionLines = useMemo(() => {
    if (isMobile) return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {goals.map((goal, i) => {
          const pos1 = getPlanetPosition(goal);
          return goals.slice(i + 1).map((otherGoal, j) => {
            const pos2 = getPlanetPosition(otherGoal);
            return (
              <line 
                key={`connection-${i}-${j}`} 
                x1={containerSize/2 + pos1.x} 
                y1={containerSize/2 + pos1.y} 
                x2={containerSize/2 + pos2.x} 
                y2={containerSize/2 + pos2.y} 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1" 
                strokeDasharray="2,4" 
                style={{
                  animation: `dashMove 3s linear infinite`,
                  opacity: hoveredGoal ? 0.3 : 0.1
                }} 
              />
            );
          });
        })}
      </svg>
    );
  }, [goals, getPlanetPosition, containerSize, hoveredGoal, isMobile]);

  return (
    <div className="flex justify-center">
      <div 
        className="relative mx-auto" 
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          perspective: '1000px'
        }}
      >
        {/* Orbit rings */}
        {goals.map(goal => (
          <div 
            key={`orbit-${goal.id}`} 
            className="absolute top-1/2 left-1/2 border border-white/10 rounded-full" 
            style={{
              width: `${goal.orbitRadius * 2}px`,
              height: `${goal.orbitRadius * 2 * 0.6}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }} 
          />
        ))}

        <SolarSystemSun 
          hoveredSun={hoveredSun} 
          setHoveredSun={setHoveredSun} 
        />

        {connectionLines}

        {goals.map(goal => {
          const position = getPlanetPosition(goal);
          return (
            <SolarSystemPlanet
              key={goal.id}
              goal={goal}
              position={position}
              containerSize={containerSize}
              hoveredGoal={hoveredGoal}
              setHoveredGoal={setHoveredGoal}
            />
          );
        })}
      </div>
    </div>
  );
});

SolarSystem.displayName = 'SolarSystem';

export default SolarSystem;
