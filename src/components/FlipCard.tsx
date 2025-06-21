
import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import { useFlipCard } from '../contexts/FlipCardContext';

interface FlipCardProps {
  frontContent: {
    value: string;
    label: string;
    icon: React.ReactNode;
  };
  backContent: {
    description: string;
  };
  cardIndex: number;
  autoFlipDelay?: number;
  className?: string;
}

const FlipCard = ({ 
  frontContent, 
  backContent, 
  cardIndex,
  autoFlipDelay = 3000, 
  className = "" 
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const { canFlip, flipCard, unflipCard } = useFlipCard();

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3 && canFlip(cardIndex)) {
        flipCard(cardIndex);
        setIsFlipped(true);
        setShowTypewriter(true);
        
        // Flip back after 10 seconds
        setTimeout(() => {
          setIsFlipped(false);
          setShowTypewriter(false);
          unflipCard(cardIndex);
        }, 10000);
      }
    }, autoFlipDelay);

    return () => clearInterval(interval);
  }, [autoFlipDelay, isHovered, cardIndex, canFlip, flipCard, unflipCard]);

  const handleMouseEnter = () => {
    if (canFlip(cardIndex)) {
      setIsHovered(true);
      flipCard(cardIndex);
      setIsFlipped(true);
      setShowTypewriter(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsFlipped(false);
    setShowTypewriter(false);
    unflipCard(cardIndex);
  };

  const handleClick = () => {
    if (!isFlipped && canFlip(cardIndex)) {
      flipCard(cardIndex);
      setIsFlipped(true);
      setShowTypewriter(true);
      
      setTimeout(() => {
        setIsFlipped(false);
        setShowTypewriter(false);
        unflipCard(cardIndex);
      }, 10000);
    } else if (isFlipped) {
      setIsFlipped(false);
      setShowTypewriter(false);
      unflipCard(cardIndex);
    }
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
          <div className="text-cpscs-gold mb-4 transform transition-transform duration-300 hover:scale-110 animated-icon-slow">
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
                speed={75}
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
