
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event, EventService } from '@/services/eventService';
import EventCard from '../components/events/EventCard';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Event['category']>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load events (will be replaced with API call)
  useEffect(() => {
    const mockEvents = EventService.getMockEvents();
    // Update status based on current date
    const eventsWithStatus = mockEvents.map(event => ({
      ...event,
      status: EventService.getEventStatus(event.date, event.registrationDeadline)
    }));
    setEvents(eventsWithStatus);
  }, []);

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

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    // Sort by date (upcoming first, then past)
    filtered.sort((a, b) => {
      if (a.status === 'upcoming' && b.status === 'past') return -1;
      if (a.status === 'past' && b.status === 'upcoming') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="reunion">Reunion</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex-1"
                >
                  <Grid size={16} className="mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                >
                  <List size={16} className="mr-2" />
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Events Grid/List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Check back soon for upcoming events!'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
                : "space-y-6"
            }>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;
