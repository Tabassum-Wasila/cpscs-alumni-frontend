
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Event, EventService } from '@/services/eventService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';
import LoginPromptModal from '@/components/events/LoginPromptModal';
import RegistrationSuccessModal from '@/components/events/RegistrationSuccessModal';
import DefaultEventBanner from '@/components/events/DefaultEventBanner';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (id) {
      const mockEvents = EventService.getMockEvents();
      const foundEvent = mockEvents.find(e => e.id === id);
      if (foundEvent) {
        setEvent({
          ...foundEvent,
          status: EventService.getEventStatus(foundEvent.date, foundEvent.registrationDeadline)
        });
      }
    }
  }, [id]);

  useEffect(() => {
    const handleFocus = () => {
      if (localStorage.getItem('pendingRegistration') === id) {
        localStorage.removeItem('pendingRegistration');
        setShowSuccessModal(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [id]);

  const handleRegistration = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (event?.registrationUrl) {
      localStorage.setItem('pendingRegistration', event.id);
      window.open(event.registrationUrl, '_blank');
    } else {
      setShowSuccessModal(true);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Event not found</h2>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isRegistrationOpen = EventService.isRegistrationOpen(event);
  const isEventFull = EventService.isEventFull(event);

  const getRegistrationSection = () => {
    if (event.status === 'past') {
      return (
        <div className="text-center py-8">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">Event Concluded</Badge>
          <p className="text-muted-foreground">This event has already taken place.</p>
        </div>
      );
    }

    if (!isRegistrationOpen || isEventFull) {
      return (
        <div className="text-center py-8">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
            {isEventFull ? 'Event Full' : 'Registration Closed'}
          </Badge>
          <p className="text-muted-foreground">
            {isEventFull 
              ? 'This event has reached its maximum capacity.'
              : `Registration deadline was ${new Date(event.registrationDeadline).toLocaleDateString()}`
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Ready to Join?</h3>
          <p className="text-muted-foreground mb-6">
            Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
          </p>
        </div>
        
        {event.registrationUrl ? (
          <div className="space-y-4 text-center">
            <Button 
              onClick={handleRegistration}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 px-8"
            >
              Register Now
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Opens registration form in new tab
            </p>
          </div>
        ) : (
          <EventRegistrationForm 
            event={event} 
            onSuccess={() => setShowSuccessModal(true)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/events')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          {/* Event Banner */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <DefaultEventBanner event={event} />
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {event.type}
              </Badge>
              <Badge variant="outline" className="capitalize bg-white/20 backdrop-blur-sm text-white border-white/30">
                {event.category}
              </Badge>
            </div>
          </div>

          {/* Single Column Layout */}
          <div className="space-y-8">
            {/* Event Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{event.title}</h1>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', month: 'long', day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm">
                      {new Date(event.date).getFullYear()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">{event.time}</div>
                    <div className="text-sm">Duration varies</div>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">{event.venue}</div>
                    <div className="text-sm">{event.type}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">{event.currentRegistrations || 0} registered</div>
                    <div className="text-sm">
                      {event.capacity ? `${event.capacity} max` : 'No limit'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <div 
                  className="prose prose-lg max-w-none text-foreground [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </CardContent>
            </Card>

            {/* Registration Section */}
            <Card>
              <CardContent className="p-8">
                {getRegistrationSection()}
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Organizer</h3>
                    <p className="text-muted-foreground">{event.organizer || 'CPSCS Alumni Association'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-muted-foreground">{event.contactEmail || 'events@cpscsalumni.org'}</p>
                  </div>
                  
                  {event.tags && event.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      
      <LoginPromptModal 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <RegistrationSuccessModal 
        open={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        eventTitle={event.title}
      />
    </div>
  );
};

export default EventDetail;
