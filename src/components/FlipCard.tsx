
import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';

interface FlipCardProps {
  frontContent: {
    value: string;
    label: string;
    icon: React.ReactNode;
  };
  backContent: {
    description: string;
  };
  autoFlipDelay?: number;
  className?: string;
}

const FlipCard = ({ frontContent, backContent, autoFlipDelay = 3000, className = "" }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    if (isHovered) return; // Don't auto-flip when user is hovering

    const interval = setInterval(() => {
      // Random chance to flip (30% chance every interval)
      if (Math.random() < 0.3) {
        setIsFlipped(true);
        setShowTypewriter(true);
        
        // Flip back after 5 seconds
        setTimeout(() => {
          setIsFlipped(false);
          setShowTypewriter(false);
        }, 5000);
      }
    }, autoFlipDelay);

    return () => clearInterval(interval);
  }, [autoFlipDelay, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsFlipped(true);
    setShowTypewriter(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsFlipped(false);
    setShowTypewriter(false);
  };

  const handleClick = () => {
    setIsFlipped(prev => {
      const newFlipped = !prev;
      setShowTypewriter(newFlipped);
      return newFlipped;
    });
  };

  return (
    <div 
      className={`flip-card-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side */}
        <div className="flip-card-front neumorphic-card p-6 flex flex-col items-center justify-center">
          <div className="text-cpscs-gold mb-4 transform transition-transform duration-300 hover:scale-110 animated-icon">
            {frontContent.icon}
          </div>
          <div className="text-3xl md:text-4xl font-bold text-cpscs-blue mb-2 text-center">
            {frontContent.value}
          </div>
          <div className="text-sm text-gray-600 text-center font-medium">
            {frontContent.label}
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back neumorphic-card p-6 flex flex-col items-center justify-center gradient-flow-bg">
          <div className="text-white text-center relative z-10">
            {showTypewriter ? (
              <TypewriterText 
                text={backContent.description}
                speed={50}
                delay={500}
                className="text-sm md:text-base leading-relaxed"
              />
            ) : (
              <p className="text-sm md:text-base leading-relaxed">
                {backContent.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
