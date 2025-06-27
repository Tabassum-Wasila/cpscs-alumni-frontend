
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { soundManager } from '../../services/soundManager';
import SolarSystemTooltip from './SolarSystemTooltip';

interface Goal {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  orbitRadius: number;
  speed: number;
  size: string;
  position: { angle: number };
  note: string;
}

interface SolarSystemPlanetProps {
  goal: Goal;
  position: { x: number; y: number; angle: number };
  containerSize: number;
  hoveredGoal: string | null;
  setHoveredGoal: (goalId: string | null) => void;
}

const SolarSystemPlanet: React.FC<SolarSystemPlanetProps> = ({ 
  goal, 
  position, 
  containerSize, 
  hoveredGoal, 
  setHoveredGoal 
}) => {
  const isMobile = useIsMobile();
  const isHovered = hoveredGoal === goal.id;

  const handlePlanetHover = (goalId: string, note: string) => {
    setHoveredGoal(goalId);
    soundManager.playPlanetaryTone(note);
  };

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

      {/* Planet tooltip */}
      <SolarSystemTooltip
        isVisible={isHovered}
        title={goal.title}
        description={goal.description}
        position="below"
      />
    </div>
  );
};

export default SolarSystemPlanet;
