
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-cpscs-light py-40 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center neumorphic-card p-8">
            <h1 className="text-9xl font-bold text-cpscs-blue mb-4">404</h1>
            <p className="text-2xl text-cpscs-blue mb-6">Page Not Found</p>
            <p className="text-gray-600 mb-8">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <Button className="bg-cpscs-blue text-white hover:bg-cpscs-blue/90">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
