
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AlumniProps {
  name: string;
  batch: string;
  profession: string;
  image: string;
  quote: string;
  delay: number;
}

const AlumniCard = ({ name, batch, profession, image, quote, delay }: AlumniProps) => {
  return (
    <div 
      className="neumorphic-card p-6 flex flex-col opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-cpscs-blue">{name}</h3>
          <p className="text-sm text-gray-600">Batch of {batch}</p>
          <p className="text-sm text-cpscs-gold font-medium">{profession}</p>
        </div>
      </div>
      
      <blockquote className="italic text-gray-600 mb-4 flex-grow">
        "{quote}"
      </blockquote>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button variant="ghost" className="text-cpscs-blue hover:text-cpscs-gold p-0">
          View Full Profile
        </Button>
      </div>
    </div>
  );
};

const FeaturedAlumni = () => {
  const alumni = [
    {
      name: "Dr. Aminul Islam",
      batch: "1995",
      profession: "Neurosurgeon at Boston Medical",
      image: "https://i.imgur.com/dvKB1GO.jpg",
      quote: "The foundation of my medical career was built at CPSCS. The discipline and knowledge I gained there have been invaluable throughout my journey.",
      delay: 0.3
    },
    {
      name: "Farida Rahman",
      batch: "2003",
      profession: "Tech Entrepreneur & CEO",
      image: "https://i.imgur.com/ug6dvbR.jpg",
      quote: "CPSCS taught me to aim high and never give up. Those values helped me build my tech company from scratch to a global enterprise.",
      delay: 0.5
    },
    {
      name: "Lt. Col. Shahriar Khan",
      batch: "1989",
      profession: "Military Officer & UN Peacekeeper",
      image: "https://i.imgur.com/zPm782I.jpg",
      quote: "The values of integrity, discipline and leadership I learned at CPSCS have guided me through my military career and international peacekeeping missions.",
      delay: 0.7
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-cpscs-blue mb-2">Featured Alumni</h2>
            <p className="text-gray-600 max-w-2xl">Our alumni are making remarkable contributions across the globe in various fields.</p>
          </div>
          
          <Button className="mt-4 md:mt-0 bg-cpscs-blue text-white hover:bg-cpscs-blue/90">
            <Link to="/alumni-directory-preview">Browse Alumni Directory</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumni.map((person, index) => (
            <AlumniCard key={index} {...person} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlumni;
