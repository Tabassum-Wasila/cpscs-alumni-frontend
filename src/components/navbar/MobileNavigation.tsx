
import React from 'react';
import { Link } from "react-router-dom";
import { navLinks } from '@/utils/navbarUtils';
import AuthButtons from './AuthButtons';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white/95 dark:bg-cpscs-dark/95 backdrop-blur-md shadow-lg border-t border-gray-200/50">
      <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        {navLinks.map((link, index) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-cpscs-blue dark:hover:text-cpscs-gold transition-colors duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={onClose}
          >
            {link.name}
          </Link>
        ))}
        
        <div className="pt-4 animate-fade-in" style={{ animationDelay: `${navLinks.length * 50}ms` }}>
          <AuthButtons isMobile={true} closeMobileMenu={onClose} />
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
