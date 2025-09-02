
import React from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { EventService } from "@/services/eventService";
import HomeEventCard from "./HomeEventCard";
import { Calendar, Sparkles } from "lucide-react";

// Loading skeleton for event cards
const EventCardSkeleton = ({ delay }: { delay: number }) => (
  <div 
    className="opacity-0 animate-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyEventsState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
      <Calendar size={32} className="text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">No Events Yet</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      We're working on exciting events for our alumni community. Check back soon for updates!
    </p>
    <Button variant="outline" asChild>
      <Link to="/contact">Suggest an Event</Link>
    </Button>
  </div>
);

const EventsSection = () => {
  // Fetch homepage events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['homepage-events'],
    queryFn: EventService.getHomePageEvents,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  // Check if section should be shown
  const { data: shouldShow } = useQuery({
    queryKey: ['show-events-section'],
    queryFn: EventService.shouldShowEventsSection,
    staleTime: 5 * 60 * 1000
  });

  // Don't render section if no events and not loading
  if (!isLoading && !error && (!events || events.length === 0) && shouldShow === false) {
    return null;
  }

  // Determine grid layout based on number of events
  const getGridLayout = (eventCount: number) => {
    if (eventCount === 1) return "grid-cols-1 lg:grid-cols-1 max-w-md mx-auto";
    if (eventCount === 2) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {isLoading ? 'Loading Events...' : 
                 events && events.length > 0 ? 'Upcoming Events' : 'Alumni Events'}
              </h2>
              {!isLoading && events && (
                <p className="text-muted-foreground text-sm mt-1">
                  {events.length === 1 ? 'Featured event' : 
                   events.length > 1 ? `${events.length} featured events` : 
                   'Stay tuned for exciting events'}
                </p>
              )}
            </div>
          </div>
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground hover-scale" 
            asChild
          >
            <Link to="/events" className="flex items-center gap-2">
              View All Events
              <Calendar size={16} />
            </Link>
          </Button>
        </div>
        
        {/* Events Grid */}
        {isLoading ? (
          <div className={`grid gap-8 ${getGridLayout(3)}`}>
            {[...Array(3)].map((_, index) => (
              <EventCardSkeleton key={index} delay={index * 0.2} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <Calendar size={32} className="text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Unable to Load Events</h3>
            <p className="text-muted-foreground mb-6">
              We're having trouble loading the latest events. Please try again later.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : !events || events.length === 0 ? (
          <EmptyEventsState />
        ) : (
          <div className={`grid gap-8 ${getGridLayout(events.length)}`}>
            {events.map((event, index) => (
              <HomeEventCard 
                key={event.id} 
                event={event} 
                delay={index * 0.2} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
