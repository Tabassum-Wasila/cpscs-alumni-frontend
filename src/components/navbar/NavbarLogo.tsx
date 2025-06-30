
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getLogoTextColorClass } from '@/utils/navbarUtils';

interface NavbarLogoProps {
  isScrolled: boolean;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ isScrolled }) => {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <Link to="/" className="flex items-center group">
      {!logoError ? (
        <img 
          src="/lovable-uploads/bd6e72b4-f5db-47e7-b477-71d8b8893647.png" 
          alt="CPSCS Alumni Logo" 
          className="h-10 w-auto md:h-12 transition-transform duration-300 group-hover:scale-105"
          onError={handleLogoError}
          loading="eager"
        />
      ) : (
        <div className={`font-poppins font-bold text-2xl transition-all duration-500 group-hover:scale-105 ${getLogoTextColorClass(isScrolled)}`}>
          <span>CPSCS</span>
          <span className="text-cpscs-gold"> Alumni</span>
        </div>
      )}
    </Link>
  );
};

export default NavbarLogo;
