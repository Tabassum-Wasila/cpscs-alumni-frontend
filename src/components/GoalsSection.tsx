import React, { useState, useEffect } from 'react';
import { Sprout, Users, Lightbulb, Wrench, Network } from 'lucide-react';
import { soundManager } from '../services/soundManager';
import { useIsMobile } from '../hooks/use-mobile';
import TwinklingStars from './TwinklingStars';

const GoalsSection = () => {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [hoveredSun, setHoveredSun] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const isMobile = useIsMobile();

  // Animation loop for orbital movement - optimized for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + (isMobile ? 0.003 : 0.005)); // Slower on mobile for better performance
    }, isMobile ? 20 : 16); // Lower FPS on mobile

    return () => clearInterval(interval);
  }, [isMobile]);

  // Dynamic scaling based on device type
  const scale = isMobile ? 0.5 : 1;
  const containerSize = 640 * scale;
  const sunSize = 80 * scale;
  const sunSizeClass = isMobile ? 'w-10 h-10' : 'w-20 h-20';
  const sunGlowClasses = isMobile 
    ? ['w-10 h-10', 'w-12 h-12', 'w-14 h-14'] // Reduced glow for mobile performance
    : ['w-20 h-20', 'w-28 h-28', 'w-36 h-36'];

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

  const handlePlanetHover = (goalId: string, note: string) => {
    setHoveredGoal(goalId);
    soundManager.playPlanetaryTone(note);
  };

  // Smart tooltip positioning for mobile - without backdrop overlay
  const getTooltipPosition = (isHovered: boolean, isForSun: boolean = false) => {
    if (!isHovered) return {};
    
    return isMobile 
      ? { 
          position: 'fixed' as const,
          top: '20%', // Higher positioning to avoid keyboard
          left: '50%',
          transform: 'translate(-50%, 0)',
          zIndex: 60,
          maxWidth: '280px'
        }
      : isForSun 
        ? { top: 'full', left: '50%', transform: 'translate(-50%, 0)', marginTop: '1rem' }
        : { top: 'full', left: '50%', transform: 'translate(-50%, 0)', marginTop: '1rem' };
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 overflow-hidden relative">
      {/* Twinkling stars background */}
      <TwinklingStars />

      {/* Galaxy nebula effects - reduced on mobile */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 ${isMobile ? 'w-48 h-48' : 'w-96 h-96'} bg-purple-600/10 rounded-full ${isMobile ? 'blur-xl' : 'blur-3xl'}`} />
        <div className={`absolute bottom-1/4 right-1/4 ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} bg-blue-600/10 rounded-full ${isMobile ? 'blur-xl' : 'blur-3xl'}`} />
        <div className={`absolute top-1/2 left-1/2 ${isMobile ? 'w-32 h-32' : 'w-64 h-64'} bg-indigo-600/10 rounded-full ${isMobile ? 'blur-lg' : 'blur-2xl'} transform -translate-x-1/2 -translate-y-1/2`} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6 leading-tight`}>
            Our Goals
          </h2>
          <p className={`text-gray-300 ${isMobile ? 'text-lg' : 'text-xl'} font-light max-w-2xl mx-auto`}>
            Like planets in our alumni solar system, each goal orbits around our central mission.
          </p>
        </div>

        {/* Interactive Solar System */}
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
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer" 
              onMouseEnter={() => setHoveredSun(true)} 
              onMouseLeave={() => setHoveredSun(false)}
              onClick={() => isMobile && setHoveredSun(!hoveredSun)}
            >
              <div className="relative">
                <div className={`${sunSizeClass} bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl`}>
                  <div className={`text-white font-bold ${isMobile ? 'text-[8px]' : 'text-sm'} text-center leading-tight`}>
                    CPSCS<br />AA
                  </div>
                </div>
                
                {/* Multiple glow layers - reduced for mobile performance */}
                <div className={`absolute inset-0 ${sunGlowClasses[0]} bg-gradient-to-r from-yellow-400/60 via-orange-500/60 to-red-500/60 rounded-full ${isMobile ? 'blur-sm' : 'blur-lg'} animate-pulse`} />
                <div className={`absolute inset-[-${isMobile ? '1px' : '4px'}] ${sunGlowClasses[1]} bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 rounded-full ${isMobile ? 'blur-md' : 'blur-xl'} animate-pulse`} />
                <div className={`absolute inset-[-${isMobile ? '2px' : '8px'}] ${sunGlowClasses[2]} bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full ${isMobile ? 'blur-lg' : 'blur-2xl'} animate-pulse`} />
                
                {/* Solar flares - scaled for mobile */}
                <div className={`absolute inset-0 ${sunSizeClass} rounded-full`}>
                  <div className={`absolute top-0 left-1/2 w-1 ${isMobile ? 'h-3' : 'h-6'} bg-gradient-to-t from-orange-400 to-transparent transform -translate-x-1/2 -translate-y-full animate-pulse`} />
                  <div className={`absolute bottom-0 right-0 w-1 ${isMobile ? 'h-2' : 'h-4'} bg-gradient-to-b from-red-400 to-transparent transform translate-y-full animate-pulse`} />
                  <div className={`absolute left-0 top-1/2 ${isMobile ? 'w-2' : 'w-4'} h-1 bg-gradient-to-l from-yellow-400 to-transparent transform -translate-x-full -translate-y-1/2 animate-pulse`} />
                </div>
              </div>

              {/* Sun hover tooltip */}
              {hoveredSun && (
                <div 
                  className="absolute z-50 animate-fade-in" 
                  style={getTooltipPosition(hoveredSun, true)}
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl whitespace-nowrap">
                    <p className="text-gray-800 font-semibold">CPSCS Alumni Association</p>
                  </div>
                </div>
              )}
            </div>

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
              const isHovered = hoveredGoal === goal.id;
              return (
                <div 
                  key={goal.id} 
                  className="absolute transition-all duration-300 cursor-pointer z-30" 
                  style={{
                    left: `${containerSize/2 + position.x}px`,
                    top: `${containerSize/2 + position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`
                  }} 
                  onMouseEnter={() => handlePlanetHover(goal.id, goal.note)} 
                  onMouseLeave={() => setHoveredGoal(null)}
                  onClick={() => isMobile && handlePlanetHover(goal.id, goal.note)}
                >
                  {/* Planet */}
                  <div className={`${goal.size} bg-gradient-to-r ${goal.color} rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isHovered ? 'ring-4 ring-white/50 shadow-2xl' : ''}`}>
                    <div className="text-white">
                      {goal.icon}
                    </div>
                  </div>

                  {/* Planet glow - reduced on mobile */}
                  <div className={`absolute inset-0 ${goal.size} bg-gradient-to-r ${goal.color} rounded-full ${isMobile ? 'blur-sm' : 'blur-md'} opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-30'}`} />

                  {/* Hover Description */}
                  {isHovered && (
                    <div 
                      className="absolute z-50 animate-fade-in" 
                      style={getTooltipPosition(isHovered)}
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl max-w-xs text-center">
                        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800 mb-2`}>{goal.title}</h3>
                        <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>{goal.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Instructions */}
        <div className="text-center mt-12">
          <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Each alumni member is a star in our galaxy, connecting through dotted lines.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
