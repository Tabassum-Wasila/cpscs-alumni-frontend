
import React from 'react';
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cpscs-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="font-poppins font-bold text-2xl mb-4">
              <span>CPSCS</span>
              <span className="text-cpscs-gold"> Alumni</span>
            </div>
            
            <p className="text-white/80 mb-4">
              Connecting generations of excellence, fostering lifelong bonds, and creating a legacy that continues beyond the classroom.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cpscs-gold hover:text-cpscs-blue transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cpscs-gold hover:text-cpscs-blue transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cpscs-gold hover:text-cpscs-blue transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-cpscs-gold">Quick Links</h3>
            
            <ul className="space-y-2">
              {['Home', 'About', 'Events', 'Directory', 'News', 'Donate', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-white/80 hover:text-cpscs-gold transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Latest Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-cpscs-gold">Latest Events</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar size={16} className="mt-1 mr-2 text-cpscs-gold" />
                <div>
                  <h4 className="font-medium">Annual Alumni Reunion</h4>
                  <p className="text-sm text-white/70">June 15, 2025 | CPSCS Campus</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar size={16} className="mt-1 mr-2 text-cpscs-gold" />
                <div>
                  <h4 className="font-medium">Career Development Workshop</h4>
                  <p className="text-sm text-white/70">July 8, 2025 | Virtual Event</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar size={16} className="mt-1 mr-2 text-cpscs-gold" />
                <div>
                  <h4 className="font-medium">Homecoming Festival</h4>
                  <p className="text-sm text-white/70">August 20, 2025 | Campus Grounds</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-cpscs-gold">Contact Us</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin size={18} className="mt-1 mr-3 text-cpscs-gold" />
                <p className="text-white/80">Cantonment Public School & College, Saidpur, Nilphamari, Bangladesh</p>
              </div>
              
              <div className="flex items-center">
                <Phone size={18} className="mr-3 text-cpscs-gold" />
                <p className="text-white/80">+880 1XXX-XXXXXX</p>
              </div>
              
              <div className="flex items-center">
                <Mail size={18} className="mr-3 text-cpscs-gold" />
                <p className="text-white/80">info@cpscsalumni.org</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} CPSCS Alumni Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
