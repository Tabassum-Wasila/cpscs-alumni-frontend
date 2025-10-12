
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event, EventService } from '@/services/eventService';
import EventCard from '../components/events/EventCard';

const Events = () => {
  const location = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  // Removed category filter and view mode - always grid view

  // Fetch banner data based on current path
  const { data: bannerResponse, isLoading: bannerLoading } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  // Fetch events using React Query
  const { data: eventsData = [], isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const events = await EventService.getMockEvents();
      // Update status based on current date
      return events.map(event => ({
        ...event,
        status: EventService.getEventStatus(event.date, event.registrationDeadline)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update local state when data changes
  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Category filter removed

    // Sort by date (upcoming first, then past)
    filtered.sort((a, b) => {
      if (a.status === 'upcoming' && b.status === 'past') return -1;
      if (a.status === 'past' && b.status === 'upcoming') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter]);

  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const pastCount = events.filter(e => e.status === 'past').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Alumni Events</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {upcomingCount} Upcoming Events
              </Badge>
              <Badge variant="outline" className="bg-muted/50">
                {pastCount} Past Events
              </Badge>
              <Badge variant="outline" className="bg-muted/50">
                {filteredEvents.length} Total Showing
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 bg-card rounded-lg p-6 border shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {eventsLoading && (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          )}

          {/* Error State */}
          {eventsError && !eventsLoading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2 text-destructive">Failed to Load Events</h3>
              <p className="text-muted-foreground mb-4">
                We're having trouble loading the events. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}

          {/* No Events State */}
          {!eventsLoading && !eventsError && filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Check back soon for upcoming events!'}
              </p>
            </div>
          )}

          {/* Events Grid/List */}
          {!eventsLoading && !eventsError && filteredEvents.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner 
        bannerData={bannerResponse?.banner || null} 
        isLoading={bannerLoading}
      />
      
      <Footer />
    </div>
  );
};

export default Events;
