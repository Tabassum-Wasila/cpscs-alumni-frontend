
import React, { useState } from 'react';

interface HoverTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({ children, tooltip, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm bg-orange-100 border border-orange-200 rounded-lg shadow-lg -top-2 left-0 transform -translate-y-full min-w-max max-w-xs">
          <div className="text-orange-800">{tooltip}</div>
          <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-200"></div>
        </div>
      )}
    </div>
  );
};

export default HoverTooltip;
