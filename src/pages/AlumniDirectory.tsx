
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AlumniDirectory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Alumni Directory</h1>
          
          <div className="mb-8">
            <p className="text-lg">
              Connect with fellow alumni from Cantonment Public School and College, Saidpur.
            </p>
          </div>
          
          {/* Placeholder content - to be replaced with actual directory */}
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl text-gray-600">
              Alumni directory coming soon! We're working on building a comprehensive database of CPSCS alumni.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AlumniDirectory;
