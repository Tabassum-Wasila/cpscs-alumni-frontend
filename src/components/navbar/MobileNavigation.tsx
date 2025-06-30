
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { navLinks } from '@/utils/navbarUtils';

interface MobileNavigationProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isScrolled, isHomePage }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    const baseClass = "px-3 py-2 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105 whitespace-nowrap";
    
    if (isScrolled) {
      return `${baseClass} ${isActive 
        ? 'bg-cpscs-blue text-white shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`;
    }
    
    if (isHomePage) {
      return `${baseClass} ${isActive 
        ? 'bg-white/20 text-white backdrop-blur-sm border border-white/30' 
        : 'text-white/90 hover:bg-white/10 hover:backdrop-blur-sm'
      }`;
    }
    
    return `${baseClass} ${isActive 
      ? 'bg-cpscs-blue text-white shadow-md' 
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;
  };

  return (
    <div className="lg:hidden mt-3">
      <div className="flex flex-wrap gap-2 justify-center px-2">
        {navLinks.map((link, index) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`${getLinkClass(link.path)} animate-fade-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
