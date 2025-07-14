import React from 'react';
import { Event, EventService } from '@/services/eventService';

interface DefaultEventBannerProps {
  event: Event;
  className?: string;
}

const DefaultEventBanner: React.FC<DefaultEventBannerProps> = ({ event, className = "" }) => {
  const colorScheme = EventService.getCategoryColorScheme(event.category);

  return (
    <div 
      className={`relative w-full aspect-video overflow-hidden rounded-lg ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Animated gradient background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} animate-gradient-flow`}
      />
      
      {/* Animated overlay patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 animate-pulse" />
          <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-white/15 animate-pulse delay-300" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-white/10 animate-pulse delay-700" />
        </div>
      </div>

      {/* Flowing particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-2 h-2 bg-white/30 rounded-full animate-float-horizontal" />
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-float-horizontal delay-500" />
        <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-horizontal delay-1000" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="text-center max-w-4xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight animate-title-glow">
            {event.title}
          </h1>
          
          {/* Subtle category badge */}
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium capitalize">
              {event.category}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay for better text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
};

export default DefaultEventBanner;