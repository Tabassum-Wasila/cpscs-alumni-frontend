
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Sponsors = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Our Sponsors</h1>
          
          <div className="mb-8">
            <p className="text-lg">
              We gratefully acknowledge the generous support of our sponsors who help make our initiatives possible.
            </p>
          </div>
          
          {/* Placeholder sponsors - to be replaced with actual sponsors */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((sponsor) => (
              <div key={sponsor} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Logo</span>
                  </div>
                  <h3 className="text-xl font-semibold">Sponsor {sponsor}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sponsors;
