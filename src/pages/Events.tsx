
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  deadline: string;
  image: string;
  slug: string;
}

const Events = () => {
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Grand Alumni Reunion 2025",
      date: "December 25, 2025",
      time: "9:00 AM - 10:00 PM",
      venue: "Cantonment Public School and College, Saidpur",
      type: "In-person",
      deadline: "November 30, 2025",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000",
      slug: "grand-alumni-reunion-2025"
    },
    {
      id: "2",
      title: "Virtual Career Workshop",
      date: "September 15, 2025",
      time: "3:00 PM - 5:00 PM",
      venue: "Zoom",
      type: "Online",
      deadline: "September 10, 2025",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1000",
      slug: "virtual-career-workshop"
    },
    {
      id: "3",
      title: "Alumni Sports Day",
      date: "October 8, 2025",
      time: "10:00 AM - 4:00 PM",
      venue: "CPSCS Sports Ground",
      type: "In-person",
      deadline: "September 30, 2025",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000",
      slug: "alumni-sports-day"
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Upcoming Events</h1>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-cpscs-gold text-cpscs-blue text-xs font-semibold px-3 py-1 rounded-full">
                    {event.type}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-cpscs-blue mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-cpscs-gold" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2 text-cpscs-gold" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-cpscs-gold" />
                      <span>{event.venue}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 font-medium">
                      Registration Deadline: {event.deadline}
                    </div>
                  </div>
                  
                  {event.id === "1" ? (
                    <Link to="/register">
                      <Button className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue transition-all duration-300">
                        Register Now
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full border-cpscs-blue text-cpscs-blue hover:bg-cpscs-blue hover:text-white transition-all duration-300">
                      Learn More
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;
