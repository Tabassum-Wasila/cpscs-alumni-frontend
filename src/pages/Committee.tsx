
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Committee = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Executive Committee</h1>
          
          <div className="mb-8">
            <p className="text-lg">
              Meet the dedicated alumni who lead our association and organize our activities.
            </p>
          </div>
          
          {/* Placeholder committee members - to be replaced with actual members */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((member) => (
              <div key={member} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold">Committee Member {member}</h3>
                <p className="text-cpscs-blue">Position</p>
                <p className="text-gray-500 mt-2">Class of 20XX</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Committee;
