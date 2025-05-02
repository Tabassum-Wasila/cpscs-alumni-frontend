
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sponsor data with updated images
const sponsors = [
  {
    id: 1,
    name: "Bangladesh Bank",
    logo: "https://i.imgur.com/CoqSTIF.jpg"
  },
  {
    id: 2,
    name: "Grameen Phone",
    logo: "https://i.imgur.com/JYNxmqf.jpg"
  },
  {
    id: 3,
    name: "Dhaka Bank",
    logo: "https://i.imgur.com/nwn1g7L.jpg"
  },
  {
    id: 4,
    name: "Bkash",
    logo: "https://i.imgur.com/j75BIZN.jpg"
  },
  {
    id: 5,
    name: "Unilever",
    logo: "https://i.imgur.com/BcF7rBZ.jpg"
  },
  {
    id: 6,
    name: "Square Group",
    logo: "https://i.imgur.com/WtfTf9U.jpg"
  }
];

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
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{sponsor.name}</h3>
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
