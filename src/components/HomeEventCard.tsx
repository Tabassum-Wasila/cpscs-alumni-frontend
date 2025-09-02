import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Event, EventService } from "@/services/eventService";

interface HomeEventCardProps {
  event: Event;
  delay: number;
}

const HomeEventCard = ({ event, delay }: HomeEventCardProps) => {
  const isRegistrationOpen = EventService.isRegistrationOpen(event);
  const isEventFull = EventService.isEventFull(event);
  const colorScheme = EventService.getCategoryColorScheme(event.category);

  const getStatusBadge = () => {
    if (event.status === 'past') {
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Past Event</Badge>;
    }
    if (isEventFull) {
      return <Badge variant="destructive">Event Full</Badge>;
    }
    if (!isRegistrationOpen) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Registration Closed</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Registration Open</Badge>;
  };

  const getActionButton = () => {
    if (event.status === 'past') {
      return (
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/events/${event.id}`}>View Details</Link>
        </Button>
      );
    }
    
    if (isEventFull || !isRegistrationOpen) {
      return (
        <Button variant="secondary" className="w-full" asChild>
          <Link to={`/events/${event.id}`}>View Details</Link>
        </Button>
      );
    }
    
    return (
      <Button className="w-full bg-primary hover:bg-primary/90" asChild>
        <Link to={`/events/${event.id}`}>Register Now</Link>
      </Button>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="group bg-card border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] opacity-0 animate-fade-in overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Event Image or Default Banner */}
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center text-white`}>
            <div className="text-center">
              <Calendar size={32} className="mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium opacity-90">{event.category.toUpperCase()}</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-black/50 text-white border-white/20 backdrop-blur-sm"
          >
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-2 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={14} className="mr-2 text-primary" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-2 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          
          {event.capacity && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users size={14} className="mr-2 text-primary" />
              <span>
                {event.currentRegistrations || 0}/{event.capacity} registered
              </span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        {getActionButton()}
      </div>
    </div>
  );
};

export default HomeEventCard;