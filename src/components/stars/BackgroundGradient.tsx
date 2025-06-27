
import React, { useState, useEffect } from 'react';

const BackgroundGradient: React.FC = () => {
  const [backgroundPhase, setBackgroundPhase] = useState(0);

  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setBackgroundPhase(prev => (prev + 0.015) % (Math.PI * 2));
    }, 100);

    return () => clearInterval(gradientInterval);
  }, []);

  const getGradientStyle = () => {
    const phase1 = Math.sin(backgroundPhase) * 0.4 + 1.0;
    const phase2 = Math.sin(backgroundPhase + Math.PI / 2) * 0.4 + 1.0;
    const phase3 = Math.sin(backgroundPhase + Math.PI) * 0.4 + 1.0;
    const phase4 = Math.sin(backgroundPhase + Math.PI * 1.5) * 0.35 + 0.95;
    
    return {
      background: `radial-gradient(circle at 25% 25%, rgba(79, 70, 229, ${phase1 * 0.15}) 0%, transparent 50%), 
                   radial-gradient(circle at 75% 50%, rgba(147, 51, 234, ${phase2 * 0.13}) 0%, transparent 50%), 
                   radial-gradient(circle at 50% 75%, rgba(59, 130, 246, ${phase3 * 0.11}) 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, rgba(168, 85, 247, ${phase4 * 0.12}) 0%, transparent 60%),
                   radial-gradient(circle at 20% 80%, rgba(236, 72, 153, ${phase1 * 0.09}) 0%, transparent 55%)`
    };
  };

  return (
    <div 
      className="absolute inset-0 transition-all duration-2000 ease-in-out"
      style={getGradientStyle()}
    />
  );
};

export default BackgroundGradient;
