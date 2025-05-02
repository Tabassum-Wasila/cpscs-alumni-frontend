
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-gradient-animated py-16 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Alumni Community Today</h2>
          
          <p className="text-white/90 text-lg mb-8">
            Connect with former classmates, attend exclusive events, access career opportunities, and give back to the institution that shaped your future.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-cpscs-blue hover:bg-cpscs-gold hover:text-white transition-all duration-300 px-6 py-6 rounded-lg shadow-lg">
              <Link to="/register">Become a Member</Link>
            </Button>
            
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-cpscs-blue transition-all duration-300 px-6 py-6 rounded-lg">
              <Link to="/donate">Support Our Initiatives</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
