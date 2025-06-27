
import React from 'react';
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

  if (!isVisible) return null;

  const getTooltipPosition = () => {
    if (isMobile) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 60,
        maxWidth: '90%',
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
      style={getTooltipPosition()}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl max-w-xs text-center">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800 mb-2`}>
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
