
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

        return (
          <line
            key={`${connection.id1}-${connection.id2}-${connection.createdAt}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
            strokeDasharray="3,6"
            style={{
              opacity: connection.opacity,
              animation: 'connectionPulse 3s ease-in-out infinite, dashMove 4s linear infinite',
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        );
      })}
    </svg>
  );
};

export default StarConnections;
