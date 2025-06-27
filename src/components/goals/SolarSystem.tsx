
import React, { useState, useEffect } from 'react';
import { Sprout, Users, Lightbulb, Wrench, Network } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import SolarSystemSun from './SolarSystemSun';
import SolarSystemPlanet from './SolarSystemPlanet';

const SolarSystem = () => {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [hoveredSun, setHoveredSun] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const isMobile = useIsMobile();

  // Animation loop for orbital movement - optimized for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + (isMobile ? 0.003 : 0.005));
    }, isMobile ? 20 : 16);

    return () => clearInterval(interval);
  }, [isMobile]);

  // Dynamic scaling based on device type
  const scale = isMobile ? 0.5 : 1;
  const containerSize = 640 * scale;

  const goals = [{
    id: 'inspire-growth',
    icon: <Sprout className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />,
    title: "Inspire Growth",
    description: "For students, alumni, and the school.",
    color: "from-green-400 to-emerald-600",
    orbitRadius: 120 * scale,
    speed: 1,
    size: isMobile ? 'w-8 h-8' : 'w-16 h-16',
    position: {
      angle: 0
    },
    note: 'C4'
  }, {
    id: 'strengthen-bonds',
    icon: <Users className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />,
    title: "Strengthen Bonds",
    description: "Across batches, borders, and generations.",
    color: "from-blue-400 to-cyan-600",
    orbitRadius: 160 * scale,
    speed: 0.8,
    size: isMobile ? 'w-7 h-7' : 'w-14 h-14',
    position: {
      angle: Math.PI * 0.4
    },
    note: 'D4'
  }, {
    id: 'fuel-impact',
    icon: <Lightbulb className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />,
    title: "Fuel Impact",
    description: "Through knowledge, action, and giving.",
    color: "from-yellow-400 to-orange-600",
    orbitRadius: 200 * scale,
    speed: 0.6,
    size: isMobile ? 'w-9 h-9' : 'w-18 h-18',
    position: {
      angle: Math.PI * 0.8
    },
    note: 'E4'
  }, {
    id: 'build-together',
    icon: <Wrench className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />,
    title: "Build Together",
    description: "Infrastructure, opportunity, and legacy.",
    color: "from-orange-400 to-red-600",
    orbitRadius: 240 * scale,
    speed: 0.4,
    size: isMobile ? 'w-8 h-8' : 'w-16 h-16',
    position: {
      angle: Math.PI * 1.2
    },
    note: 'G4'
  }, {
    id: 'evolve-forward',
    icon: <Network className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />,
    title: "Evolve Forward",
    description: "Digitally, socially, and sustainably.",
    color: "from-purple-400 to-indigo-600",
    orbitRadius: 280 * scale,
    speed: 0.3,
    size: isMobile ? 'w-7 h-7' : 'w-14 h-14',
    position: {
      angle: Math.PI * 1.6
    },
    note: 'A4'
  }];

  // Calculate planet positions based on time
  const getPlanetPosition = (goal: typeof goals[0]) => {
    const angle = goal.position.angle + animationTime * goal.speed;
    const x = Math.cos(angle) * goal.orbitRadius;
    const y = Math.sin(angle) * goal.orbitRadius * 0.6; // Elliptical orbit
    return {
      x,
      y,
      angle
    };
  };

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

        {/* Central Sun - CPSCS-AA */}
        <SolarSystemSun 
          hoveredSun={hoveredSun} 
          setHoveredSun={setHoveredSun} 
        />

        {/* Connection lines between planets - simplified for mobile */}
        {!isMobile && (
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
        )}

        {/* Orbiting Goals */}
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
};

export default SolarSystem;
