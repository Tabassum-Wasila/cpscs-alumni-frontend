
import React from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  isTwinkling: boolean;
}

interface Connection {
  id1: number;
  id2: number;
  opacity: number;
  createdAt: number;
  delay: number;
}

interface StarConnectionsProps {
  stars: Star[];
  connections: Connection[];
}

const StarConnections: React.FC<StarConnectionsProps> = ({ stars, connections }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {connections.map(connection => {
        const star1 = stars.find(s => s.id === connection.id1);
        const star2 = stars.find(s => s.id === connection.id2);
        if (!star1 || !star2) return null;

        const x1 = (star1.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
        const y1 = (star1.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);
        const x2 = (star2.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
        const y2 = (star2.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);

        // Calculate distance for line thickness variation
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const maxDistance = Math.sqrt(Math.pow(window.innerWidth || 1920, 2) + Math.pow(window.innerHeight || 1080, 2));
        const thickness = Math.max(0.8, 2 - (distance / maxDistance) * 1.5);

        return (
          <line
            key={`${connection.id1}-${connection.id2}-${connection.createdAt}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={thickness}
            strokeDasharray="4,8"
            style={{
              opacity: connection.opacity,
              animation: 'connectionPulse 2.5s ease-in-out infinite, dashMove 3s linear infinite',
              transition: 'opacity 0.4s ease-in-out',
              filter: connection.opacity > 0.3 ? 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' : 'none'
            }}
          />
        );
      })}
    </svg>
  );
};

export default StarConnections;
