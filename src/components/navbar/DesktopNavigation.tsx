
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { navLinks, getLinkColorClass } from '@/utils/navbarUtils';

interface DesktopNavigationProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ isScrolled, isHomePage }) => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center space-x-6">
      {navLinks.map((link) => (
        <Link 
          key={link.path} 
          to={link.path} 
          className={`text-sm font-medium tracking-wide relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cpscs-gold after:transition-all after:duration-300 hover:after:w-full transition-all duration-500 hover:scale-105 ${
            location.pathname === link.path ? 'after:w-full' : ''
          } ${getLinkColorClass(isScrolled, isHomePage)}`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default DesktopNavigation;
