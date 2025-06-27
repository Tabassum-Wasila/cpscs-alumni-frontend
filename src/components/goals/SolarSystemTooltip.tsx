
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

    // Smart mobile positioning with viewport detection
    const updatePosition = () => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      const safeArea = {
        top: 20,
        bottom: 20,
        left: 16,
        right: 16
      };

      setTooltipPosition({
        top: viewport.height * 0.15, // Position near top for better visibility
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
        right: '16px',
        zIndex: 60,
        maxWidth: 'calc(100vw - 32px)',
        width: 'auto'
      };
    }
    
    return position === 'center' 
      ? { 
          position: 'absolute' as const,
          top: 'calc(100% + 1rem)', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 50,
          whiteSpace: 'nowrap' as const
        }
      : { 
          position: 'absolute' as const,
          top: 'calc(100% + 1rem)', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 50
        };
  };

  return (
    <div 
      className="animate-fade-in" 
      style={getTooltipStyle()}
    >
      <div className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl text-center ${
        isMobile 
          ? 'border border-white/30' 
          : 'max-w-xs'
      }`}>
        <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-gray-800 mb-2`}>
          {title}
        </h3>
        {description && (
          <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SolarSystemTooltip;
