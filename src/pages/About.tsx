
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">About CPSCS Alumni Association</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              The Cantonment Public School and College, Saidpur Alumni Association connects generations of graduates, 
              fostering a strong community that celebrates our shared history and supports current students.
            </p>
            
            {/* Content to be expanded later */}
            <p className="text-gray-600 italic">More content about our mission, vision, and history coming soon...</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
