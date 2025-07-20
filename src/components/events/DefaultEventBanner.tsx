
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Event, EventService } from '@/services/eventService';

interface DefaultEventBannerProps {
  event: Event;
}

const DefaultEventBanner: React.FC<DefaultEventBannerProps> = ({ event }) => {
  const colorScheme = EventService.getCategoryColorScheme(event.category);

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${colorScheme.gradient} flex flex-col items-center justify-center text-white p-6 overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-1 text-sm opacity-90">
          <div className="flex items-center justify-center">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center justify-center">
            <MapPin size={14} className="mr-1" />
            <span className="truncate max-w-[150px]">{event.venue}</span>
          </div>
        </div>
        
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5 blur-lg" />
      </div>
    </div>
  );
};

export default DefaultEventBanner;
