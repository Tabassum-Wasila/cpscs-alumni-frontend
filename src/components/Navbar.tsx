
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if we're on a page with animated background
    const hasAnimatedBg = document.querySelector('.animated-bg, .gradient-flow-bg');
    if (hasAnimatedBg && !isScrolled) {
      // Cycle through dark/light states to match the background animation
      const interval = setInterval(() => {
        setIsDarkBackground(prev => !prev);
      }, 3000); // Adjust timing to match your background animation
      
      return () => clearInterval(interval);
    } else {
      setIsDarkBackground(false);
    }
  }, [isScrolled]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'Alumni Directory', path: '/alumni-directory' },
    { name: 'Committee', path: '/committee' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'Mentorship & Career', path: '/mentorship-career' },
    { name: 'Magazine', path: '/magazine' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  // Dynamic text color classes based on background state
  const getTextColorClass = () => {
    if (isScrolled) {
      return 'text-gray-900 dark:text-white';
    }
    return isDarkBackground ? 'text-white' : 'text-gray-900';
  };

  const getLinkColorClass = () => {
    if (isScrolled) {
      return 'text-gray-700 hover:text-cpscs-blue dark:text-gray-300 dark:hover:text-cpscs-gold';
    }
    return isDarkBackground 
      ? 'text-white/90 hover:text-cpscs-gold' 
      : 'text-gray-700 hover:text-cpscs-blue';
  };

  const getLogoTextColorClass = () => {
    if (isScrolled) {
      return 'text-cpscs-blue';
    }
    return isDarkBackground ? 'text-white' : 'text-cpscs-blue';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 dark:bg-cpscs-dark/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          {!logoError ? (
            <img 
              src="/lovable-uploads/bd6e72b4-f5db-47e7-b477-71d8b8893647.png" 
              alt="CPSCS Alumni Logo" 
              className="h-10 w-auto md:h-12"
              onError={handleLogoError}
              loading="eager"
            />
          ) : (
            <div className={`font-poppins font-bold text-2xl transition-colors duration-500 ${getLogoTextColorClass()}`}>
              <span>CPSCS</span>
              <span className="text-cpscs-gold"> Alumni</span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-sm font-medium tracking-wide relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cpscs-gold after:transition-all after:duration-300 hover:after:w-full transition-colors duration-500 ${getLinkColorClass()}`}
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-white">
                  <User size={16} />
                  <span>{user?.fullName?.split(' ')[0] || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/complete-profile" className="w-full">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/alumni-directory" className="w-full">Alumni Directory</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-white"
                asChild
              >
                <Link to="/login">
                  <User size={16} />
                  <span>Login</span>
                </Link>
              </Button>
              <Button
                className="flex items-center gap-2 bg-cpscs-blue hover:bg-blue-700"
                asChild
              >
                <Link to="/signup">
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden p-2 focus:outline-none transition-colors duration-500 ${getTextColorClass()}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-cpscs-dark shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/complete-profile" 
                  className="py-2 border-b border-gray-100 dark:border-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  to="/alumni-directory" 
                  className="py-2 border-b border-gray-100 dark:border-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Alumni Directory
                </Link>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 border-red-500 text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-white"
                  asChild
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <User size={16} />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button 
                  className="flex items-center justify-center gap-2 bg-cpscs-blue hover:bg-blue-700"
                  asChild
                >
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
                <Link 
                  to="/register" 
                  className="py-2 border-b border-gray-100 dark:border-gray-800 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register for Reunion
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
