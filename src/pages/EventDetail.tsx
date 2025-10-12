import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import ReunionRegistrationForm from '@/components/events/ReunionRegistrationForm';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch event data using React Query
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      const eventData = await EventService.getEventById(id);
      if (eventData) {
        return {
          ...eventData,
          status: EventService.getEventStatus(eventData.date, eventData.registrationDeadline)
        };
      }
      return null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check for registration completion on window focus (for external forms)
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
      // Mark pending registration for external forms
      localStorage.setItem('pendingRegistration', event.id);
      window.open(event.registrationUrl, '_blank');
    } else {
      // Use internal form
      setShowSuccessModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {error ? 'Failed to load event' : 'Event not found'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {error ? 'Please try again later.' : 'The event you are looking for does not exist.'}
            </p>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isRegistrationOpen = EventService.isRegistrationOpen(event);

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
            {event.isSpecialEvent && event.id === 'grand-reunion-2025' ? (
              <img 
                src="https://i.postimg.cc/26Fswft0/Grand-Alumni-Reunion-Banner-2025.jpg" 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : event.image ? (
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
            </div>
          </div>

          {/* Event Info - Single Column Layout */}
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{event.title}</h1>
            
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-3 h-5 w-5 text-primary" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-3 h-5 w-5 text-primary" />
                <span>{event.venue}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Users className="mr-3 h-5 w-5 text-primary" />
                <span>{event.currentRegistrations || 0} registered</span>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none text-foreground mb-8"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />

            {/* Registration Section */}
            <Card className="w-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Registration</h3>
                
                {event.status === 'past' ? (
                  <div className="text-center py-4">
                    <Badge variant="secondary" className="mb-4">Event Concluded</Badge>
                    <p className="text-muted-foreground">This event has already taken place.</p>
                  </div>
                ) : !isRegistrationOpen ? (
                  <div className="text-center py-4">
                    <Badge variant="outline" className="mb-4">Registration Closed</Badge>
                    <p className="text-muted-foreground">
                      Registration deadline was {EventService.formatDateForDisplay(event.registrationDeadline)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Registration deadline: {EventService.formatDateForDisplay(event.registrationDeadline)}
                      </p>
                    </div>
                    
                    {/* Special Reunion Registration Form */}
                    {event.isSpecialEvent && event.title === "Grand Alumni Reunion 2025" ? (
                      user ? (
                        <ReunionRegistrationForm 
                          eventId={event.id} 
                          onSuccess={() => setShowSuccessModal(true)} 
                        />
                      ) : (
                        <div className="text-center">
                          <Button 
                            onClick={handleRegistration}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                          >
                            Login to Register for Reunion
                          </Button>
                        </div>
                      )
                    ) : event.registrationUrl ? (
                      <div className="space-y-4">
                        <Button 
                          onClick={handleRegistration}
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                        >
                          Register for Event
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          You must be logged in to register
                        </p>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleRegistration}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                      >
                        Register for Event
                      </Button>
                    )}
                  </div>
                )}
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