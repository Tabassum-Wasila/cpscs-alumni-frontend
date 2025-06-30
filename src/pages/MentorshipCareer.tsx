
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MentorshipCareer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-40 lg:pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Mentorship & Career</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-cpscs-blue">Mentorship Program</h2>
              <p className="mb-4">
                Our mentorship program connects current students and recent graduates with experienced alumni 
                who provide guidance, advice, and support in their academic and professional journeys.
              </p>
              <button className="bg-cpscs-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-cpscs-blue">Career Development</h2>
              <p className="mb-4">
                Explore career opportunities, professional development resources, and networking events 
                designed to help CPSCS alumni advance in their chosen fields.
              </p>
              <button className="bg-cpscs-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Coming Soon
              </button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Join Our Network</h2>
            <p className="text-center mb-6">
              Whether you're looking to be mentored or want to give back by becoming a mentor, 
              we welcome your participation in our growing network of professionals.
            </p>
            <div className="flex justify-center">
              <button className="bg-cpscs-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                Register Interest
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MentorshipCareer;
