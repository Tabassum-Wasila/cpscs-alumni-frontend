
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import SolarSystemTooltip from './SolarSystemTooltip';

interface SolarSystemSunProps {
  hoveredSun: boolean;
  setHoveredSun: (hovered: boolean) => void;
}

const SolarSystemSun: React.FC<SolarSystemSunProps> = ({ hoveredSun, setHoveredSun }) => {
  const isMobile = useIsMobile();
  const scale = isMobile ? 0.5 : 1;
  const sunSizeClass = isMobile ? 'w-10 h-10' : 'w-20 h-20';
  const sunGlowClasses = isMobile 
    ? ['w-10 h-10', 'w-12 h-12', 'w-14 h-14']
    : ['w-20 h-20', 'w-28 h-28', 'w-36 h-36'];

  return (
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer" 
      onMouseEnter={() => setHoveredSun(true)} 
      onMouseLeave={() => setHoveredSun(false)}
      onClick={() => isMobile && setHoveredSun(!hoveredSun)}
    >
      <div className="relative">
        {/* Multiple glow layers - positioned BEHIND the sun */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sunGlowClasses[0]} bg-gradient-to-r from-yellow-400/60 via-orange-500/60 to-red-500/60 rounded-full ${isMobile ? 'blur-sm' : 'blur-lg'} animate-pulse -z-10`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sunGlowClasses[1]} bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 rounded-full ${isMobile ? 'blur-md' : 'blur-xl'} animate-pulse -z-10`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sunGlowClasses[2]} bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full ${isMobile ? 'blur-lg' : 'blur-2xl'} animate-pulse -z-10`} />
        
        {/* Main sun body */}
        <div className={`${sunSizeClass} bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl relative z-10`}>
          <div className={`text-white font-bold ${isMobile ? 'text-[5px]' : 'text-[10px]'} text-center leading-tight`}>
            CPSCS<br />AA
          </div>
        </div>
        
        {/* Solar flares - scaled for mobile */}
        <div className={`absolute inset-0 ${sunSizeClass} rounded-full z-5`}>
          <div className={`absolute top-0 left-1/2 w-1 ${isMobile ? 'h-3' : 'h-6'} bg-gradient-to-t from-orange-400 to-transparent transform -translate-x-1/2 -translate-y-full animate-pulse`} />
          <div className={`absolute bottom-0 right-0 w-1 ${isMobile ? 'h-2' : 'h-4'} bg-gradient-to-b from-red-400 to-transparent transform translate-y-full animate-pulse`} />
          <div className={`absolute left-0 top-1/2 ${isMobile ? 'w-2' : 'w-4'} h-1 bg-gradient-to-l from-yellow-400 to-transparent transform -translate-x-full -translate-y-1/2 animate-pulse`} />
        </div>
      </div>

      {/* Sun tooltip */}
      <SolarSystemTooltip
        isVisible={hoveredSun}
        title="CPSCS Alumni Association"
        position="center"
      />
    </div>
  );
};

export default SolarSystemSun;
