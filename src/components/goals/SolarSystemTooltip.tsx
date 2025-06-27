
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

interface SolarSystemTooltipProps {
  isVisible: boolean;
  title: string;
  description?: string;
  position: 'center' | 'below';
}

const SolarSystemTooltip: React.FC<SolarSystemTooltipProps> = ({ 
  isVisible, 
  title, 
  description, 
  position 
}) => {
  const isMobile = useIsMobile();
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isVisible || !isMobile) return;

    const updatePosition = () => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Safe area for devices with notches/rounded corners
      const safeArea = {
        top: Math.max(20, window.screen.height - window.innerHeight),
        bottom: 20,
        left: 16,
        right: 16
      };

      setTooltipPosition({
        top: viewport.height * 0.12,
        left: safeArea.left
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isVisible, isMobile]);

  if (!isVisible) return null;

  const getTooltipStyle = () => {
    if (isMobile) {
      return {
        position: 'fixed' as const,
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        width: `calc(100vw - 32px)`,
        minWidth: '280px',
        maxWidth: `calc(100vw - 32px)`,
        zIndex: 60,
      };
    }
    
    return position === 'center' 
      ? { 
          position: 'absolute' as const,
          top: 'calc(100% + 1rem)', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 50,
          whiteSpace: 'nowrap' as const,
          minWidth: '200px'
        }
      : { 
          position: 'absolute' as const,
          top: 'calc(100% + 1rem)', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 50,
          maxWidth: '300px',
          minWidth: '250px'
        };
  };

  return (
    <div 
      className="animate-fade-in" 
      style={getTooltipStyle()}
    >
      <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl text-center border border-white/30 ${
        isMobile 
          ? 'p-4 w-full' 
          : 'p-4'
      }`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800 mb-2`}>
          {title}
        </h3>
        {description && (
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-sm'} leading-relaxed`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SolarSystemTooltip;
