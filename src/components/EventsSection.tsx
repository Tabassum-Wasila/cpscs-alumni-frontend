
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventProps {
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  delay: number;
}

const EventCard = ({ title, date, time, location, image, category, delay }: EventProps) => {
  return (
    <div 
      className="neumorphic-card overflow-hidden transition-all duration-300 hover:translate-y-[-5px] opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-cpscs-gold text-cpscs-blue text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-cpscs-blue mb-3">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-cpscs-gold" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-cpscs-gold" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-cpscs-gold" />
            <span>{location}</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full border-cpscs-blue text-cpscs-blue hover:bg-cpscs-blue hover:text-white transition-all duration-300">
          RSVP Now
        </Button>
      </div>
    </div>
  );
};

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: "Annual Alumni Reunion 2025",
      date: "June 15, 2025",
      time: "6:00 PM - 10:00 PM",
      location: "CPSCS Campus, Saidpur",
      image: "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?q=80&w=1000",
      category: "Reunion",
      delay: 0.3
    },
    {
      title: "Career Development Workshop",
      date: "July 8, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Virtual Event",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1000",
      category: "Workshop",
      delay: 0.5
    },
    {
      title: "Homecoming Festival",
      date: "August 20, 2025",
      time: "11:00 AM - 8:00 PM",
      location: "CPSCS Campus Grounds",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000",
      category: "Festival",
      delay: 0.7
    }
  ];

  return (
    <section className="py-16 bg-cpscs-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-cpscs-blue">Upcoming Events</h2>
          <Button className="mt-4 md:mt-0 bg-cpscs-gold text-cpscs-blue hover:bg-cpscs-gold/80">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
