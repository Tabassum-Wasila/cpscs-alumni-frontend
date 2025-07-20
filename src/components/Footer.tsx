
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-animated relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/5"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* About Section */}
          <div className="text-center lg:text-left">
            <div className="font-poppins font-bold text-4xl mb-6">
              <span className="text-white">CPSCS</span>
              <span className="text-cpscs-gold"> Alumni</span>
            </div>
            
            <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Connecting generations of excellence, fostering lifelong bonds, and creating a legacy that continues beyond the classroom.
            </p>
            
            {/* Social Actions */}
            <div className="space-y-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto group"
                onClick={() => window.open('https://www.facebook.com/groups/CPSCSAlumni', '_blank')}
              >
                <Facebook className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Join our Facebook group
              </Button>
              
              <div className="flex justify-center lg:justify-start">
                <a 
                  href="https://wa.me/8801718787515" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white/90 hover:text-white transition-colors duration-300 group"
                >
                  <MessageCircle className="mr-2 h-5 w-5 text-green-400 group-hover:animate-bounce" />
                  WhatsApp: +8801718787515
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-semibold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 lg:after:left-0 after:transform after:-translate-x-1/2 lg:after:translate-x-0 after:h-0.5 after:w-16 after:bg-cpscs-gold">
              Contact Us
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start justify-center lg:justify-start group">
                <MapPin className="mt-1 mr-4 text-cpscs-gold h-6 w-6 group-hover:animate-pulse" />
                <p className="text-white/90 text-lg">
                  Cantonment Public School & College,<br />
                  Saidpur, Nilphamari, Bangladesh
                </p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start group">
                <MessageCircle className="mr-4 text-green-400 h-6 w-6 group-hover:animate-bounce" />
                <a 
                  href="https://wa.me/8801718787515" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white text-lg transition-colors duration-300"
                >
                  +8801718787515
                </a>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start group">
                <Mail className="mr-4 text-cpscs-gold h-6 w-6 group-hover:animate-pulse" />
                <a 
                  href="mailto:cpscsalumniassociation@gmail.com"
                  className="text-white/90 hover:text-white text-lg transition-colors duration-300"
                >
                  cpscsalumniassociation@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 text-center">
          <a 
            href="https://tinkers.ltd/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white text-sm transition-colors duration-300 hover:underline"
          >
            © Developed & maintained by Tinkers Technologies Ltd
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
