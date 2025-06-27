
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { soundManager } from '../../services/soundManager';
import { GoalData } from '../../data/goalsData';
import SolarSystemTooltip from './SolarSystemTooltip';

interface SolarSystemPlanetProps {
  goal: GoalData;
  position: { x: number; y: number; angle: number };
  containerSize: number;
  hoveredGoal: string | null;
  setHoveredGoal: (goalId: string | null) => void;
}

const SolarSystemPlanet: React.FC<SolarSystemPlanetProps> = React.memo(({ 
  goal, 
  position, 
  containerSize, 
  hoveredGoal, 
  setHoveredGoal 
}) => {
  const isMobile = useIsMobile();
  const isHovered = hoveredGoal === goal.id;
  const IconComponent = goal.icon;

  const handlePlanetHover = (goalId: string, note: string) => {
    setHoveredGoal(goalId);
    soundManager.playPlanetaryTone(note);
  };

  return (
    <div 
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
      <div className={`${goal.size} bg-gradient-to-r ${goal.color} rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isHovered ? 'ring-4 ring-white/50 shadow-2xl' : ''}`}>
        <div className="text-white">
          <IconComponent className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
        </div>
      </div>

      <div className={`absolute inset-0 ${goal.size} bg-gradient-to-r ${goal.color} rounded-full ${isMobile ? 'blur-sm' : 'blur-md'} opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-30'}`} />

      <SolarSystemTooltip
        isVisible={isHovered}
        title={goal.title}
        description={goal.description}
        position="below"
      />
    </div>
  );
});

SolarSystemPlanet.displayName = 'SolarSystemPlanet';

export default SolarSystemPlanet;
