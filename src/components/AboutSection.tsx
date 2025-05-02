
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cpscs-gold/20 rounded-full blur-xl z-0"></div>
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src="https://i.imgur.com/JRSeRaX.jpg" 
                  alt="CPSCS Campus" 
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cpscs-blue/20 rounded-full blur-xl z-0"></div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-cpscs-blue mb-4">About Our Alumni Association</h2>
              
              <p className="text-gray-700 leading-relaxed">
                The Cantonment Public School and College, Saidpur Alumni Association is more than just an organization; it's a community that celebrates our shared history and bright future. Since its inception, our association has been dedicated to fostering strong connections among alumni and supporting the institution that shaped us.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Our mission is to strengthen the ties between alumni, current students, and the institution. We strive to create meaningful networking opportunities, facilitate professional growth, and give back to our alma mater through various initiatives and scholarship programs.
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="neumorphic-card p-4">
                  <h4 className="font-semibold text-cpscs-blue mb-2">Our Values</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Excellence in education</li>
                    <li>• Lifelong connections</li>
                    <li>• Community service</li>
                    <li>• Professional development</li>
                  </ul>
                </div>
                
                <div className="neumorphic-card p-4">
                  <h4 className="font-semibold text-cpscs-blue mb-2">Our Goals</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Unite alumni globally</li>
                    <li>• Support student scholarships</li>
                    <li>• Organize meaningful events</li>
                    <li>• Preserve school traditions</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="bg-cpscs-blue hover:bg-cpscs-blue/90 text-white">
                  <Link to="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
