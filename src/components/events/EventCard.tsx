import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, EventService } from '@/services/eventService';
import DefaultEventBanner from './DefaultEventBanner';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isRegistrationOpen = EventService.isRegistrationOpen(event);
  const isEventFull = EventService.isEventFull(event);
  const colorScheme = EventService.getCategoryColorScheme(event.category);

  const getStatusBadge = () => {
    if (event.status === 'past') {
      return <Badge variant="secondary">Past Event</Badge>;
    }
    if (isEventFull) {
      return <Badge variant="destructive">Full</Badge>;
    }
    if (!isRegistrationOpen) {
      return <Badge variant="outline">Registration Closed</Badge>;
    }
    return <Badge className="bg-green-600 hover:bg-green-700">Open for Registration</Badge>;
  };

  const getActionButton = () => {
    if (event.status === 'past') {
      return (
        <Button variant="outline" className="w-full" disabled>
          Event Concluded
        </Button>
      );
    }

    if (!isRegistrationOpen || isEventFull) {
      return (
        <Link to={`/events/${event.id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      );
    }

    return (
      <Link to={`/events/${event.id}`}>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Register Now
          {event.registrationUrl && <ExternalLink size={16} className="ml-2" />}
        </Button>
      </Link>
    );
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group h-full flex flex-col">
      {/* Event Banner */}
      <div className="relative h-48 flex-shrink-0">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full">
            <DefaultEventBanner event={event} />
          </div>
        )}
        
        {/* Status and Type badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge 
            variant="secondary" 
            className="bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            {event.type}
          </Badge>
          {getStatusBadge()}
        </div>
      </div>
      
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <Badge variant="outline" className="capitalize ml-2">
            {event.category}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-2 text-primary" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-2 text-primary" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-2 text-primary" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={16} className="mr-2 text-primary" />
            <span>
              {event.currentRegistrations || 0} people registered
            </span>
          </div>

          <div className="text-sm font-medium text-muted-foreground">
            Registration Deadline: {EventService.formatDateForDisplay(event.registrationDeadline)}
          </div>
          
          {/* Description preview with rich text support */}
          <div 
            className="text-sm text-muted-foreground line-clamp-2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: event.description.substring(0, 120) + '...'
            }}
          />
        </div>
        
        <div className="mt-auto">
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;