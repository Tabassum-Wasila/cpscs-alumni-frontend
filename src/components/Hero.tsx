import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { reunionService, ReunionData } from '@/services/reunionService';
import { Skeleton } from "@/components/ui/skeleton";
const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Fetch active reunion data
  const { data: reunionData, isLoading } = useQuery({
    queryKey: ['active-reunion'],
    queryFn: reunionService.getActiveReunion,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  const showReunionContent = reunionData?.is_reunion && reunionData?.is_active;
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
    if (!reunionData?.event_date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const reunionDate = new Date(reunionData.event_date).getTime();
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
    if (!showReunionContent) return;
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [reunionData, showReunionContent]);
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
          
          {/* Countdown Timer for Active Reunion */}
          {isLoading ? (
            <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <Skeleton className="h-24 w-80 mx-auto rounded-lg" />
            </div>
          ) : showReunionContent ? (
            <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="text-cpscs-gold mr-2" size={20} />
                  <h3 className="text-cpscs-gold text-lg font-semibold">
                    {reunionData?.title || 'Grand Alumni Reunion'}
                  </h3>
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
          ) : null}
          
          {/* Register for Reunion Button - Only show when active reunion exists */}
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in" style={{
            animationDelay: '0.9s'
          }}>
            {isLoading ? (
              <Skeleton className="h-12 w-48 rounded-lg" />
            ) : showReunionContent ? (
              <Button className="relative bg-gradient-to-r from-cpscs-gold via-yellow-400 to-cpscs-gold hover:from-yellow-300 hover:via-cpscs-gold hover:to-yellow-300 text-cpscs-blue hover:text-cpscs-blue font-bold px-8 py-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse hover:animate-none border-2 border-cpscs-gold/50 hover:border-white/30">
                <Link to={`/events/${reunionData?.event_id}`} className="flex items-center gap-2">
                  <span className="relative z-10">Register for Reunion</span>
                  <ArrowRight size={16} className="relative z-10" />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              </Button>
            ) : null}
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