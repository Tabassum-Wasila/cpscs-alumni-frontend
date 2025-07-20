
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

interface Connection {
  particle1: Particle;
  particle2: Particle;
  opacity: number;
}

const EnhancedModalBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Create particles
    const newParticles: Particle[] = [];
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.velocityX + 100) % 100,
          y: (particle.y + particle.velocityY + 100) % 100,
          opacity: 0.2 + Math.sin(Date.now() * 0.001 + particle.id) * 0.3
        }))
      );

      // Update connections
      setConnections(prevConnections => {
        const newConnections: Connection[] = [];
        
        particles.forEach((particle1, i) => {
          particles.slice(i + 1).forEach(particle2 => {
            const distance = Math.sqrt(
              Math.pow(particle1.x - particle2.x, 2) + 
              Math.pow(particle1.y - particle2.y, 2)
            );
            
            if (distance < 20 && Math.random() > 0.7) {
              newConnections.push({
                particle1,
                particle2,
                opacity: Math.max(0, 0.4 - distance * 0.02)
              });
            }
          });
        });
        
        return newConnections.slice(0, 8); // Limit connections for performance
      });
    }, 100);

    return () => clearInterval(animationInterval);
  }, [particles]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute transition-all duration-1000 ease-out"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size * 2}px`,
              height: `${particle.size * 2}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 4}px ${particle.color}40`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Particle connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => (
          <line
            key={`connection-${index}`}
            x1={`${connection.particle1.x}%`}
            y1={`${connection.particle1.y}%`}
            x2={`${connection.particle2.x}%`}
            y2={`${connection.particle2.y}%`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            opacity={connection.opacity}
            className="animate-pulse"
          />
        ))}
      </svg>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <div
              className="w-8 h-8 border-2 border-primary/30 rotate-45"
              style={{
                borderRadius: i % 2 === 0 ? '0%' : '50%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Ambient light orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 25}%`,
              width: '200px',
              height: '200px',
              background: `radial-gradient(circle, ${['#3b82f6', '#8b5cf6', '#06b6d4'][i]}40 0%, transparent 70%)`,
              animation: `pulse ${6 + i * 2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedModalBackground;
