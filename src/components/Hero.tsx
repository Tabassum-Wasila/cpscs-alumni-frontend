import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const {
        clientX,
        clientY
      } = e;
      const {
        width,
        height
      } = heroRef.current.getBoundingClientRect();
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      const elements = heroRef.current.querySelectorAll('.parallax');
      elements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed') || '1');
        (el as HTMLElement).style.transform = `translate(${-x * speed}px, ${-y * speed}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Function to calculate time until the reunion
  const calculateTimeLeft = () => {
    const reunionDate = new Date('December 25, 2025 09:00:00').getTime();
    const now = new Date().getTime();
    const difference = reunionDate - now;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      const minutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
      const seconds = Math.floor(difference % (1000 * 60) / 1000);
      return {
        days,
        hours,
        minutes,
        seconds
      };
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  };
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-32 h-32 rounded-full bg-cpscs-gold/30 blur-3xl parallax" data-speed="3"></div>
        <div className="absolute top-[50%] right-[10%] w-40 h-40 rounded-full bg-blue-500/20 blur-3xl parallax" data-speed="2"></div>
        <div className="absolute bottom-[10%] left-[35%] w-36 h-36 rounded-full bg-purple-500/20 blur-3xl parallax" data-speed="1.5"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 opacity-0 animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cpscs-gold text-2xl">Cantonment Public School &amp; College,  Saidpur</span>
            <br />
            <span className="text-white text-4xl">Alumni Association</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{
          animationDelay: '0.6s'
        }}>
            Connecting generations of excellence, fostering lifelong bonds, and creating a legacy that continues beyond the classroom.
          </p>
          
          {/* Countdown Timer for Grand Reunion */}
          <div className="mb-8 opacity-0 animate-fade-in" style={{
          animationDelay: '0.7s'
        }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="text-cpscs-gold mr-2" size={20} />
                <h3 className="text-cpscs-gold text-lg font-semibold">Grand Alumni Reunion 2025</h3>
              </div>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-xs text-gray-300">DAYS</div>
                </div>
                <div className="text-white text-xl md:text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-300">HOURS</div>
                </div>
                <div className="text-white text-xl md:text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-300">MINS</div>
                </div>
                <div className="text-white text-xl md:text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-xs text-gray-300">SECS</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in" style={{
          animationDelay: '0.9s'
        }}>
            <Button className="bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue text-white font-medium px-6 py-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Link to="/about" className="flex items-center gap-2">
                Learn About Us
                <ArrowRight size={16} />
              </Link>
            </Button>
            
            <Button variant="outline" className="bg-transparent border-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-cpscs-blue font-medium px-6 py-6 rounded-lg transition-all duration-300 hover:scale-105">
              <Link to="/events">Upcoming Events</Link>
            </Button>
            
            <Button className="bg-cpscs-gold text-cpscs-blue font-medium px-6 py-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse">
              <Link to="/register" className="flex items-center gap-2">
                Register for Reunion
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </div>;
};
export default Hero;