
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getLogoTextColorClass } from '@/utils/navbarUtils';

interface NavbarLogoProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ isScrolled, isHomePage }) => {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <Link to="/" className="flex items-center group">
      {!logoError ? (
        <img 
          // এই লোগো এর লিংক এক্সটার্নাল সার্ভার থেকে আনা। ডেভেলপারকে পরে এই লোগো আমাদের নিজের সার্ভারে হোস্ট করে ডিরেক্ট লিংক দিতে হবে।
          src="https://i.postimg.cc/G3GzHF5n/Transparent-cpscs-alumni-logo-munem.png" 
          alt="CPSCS Alumni Logo" 
          className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform duration-300 group-hover:scale-105"
          onError={handleLogoError}
          loading="eager"
        />
      ) : (
        <div className={`font-poppins font-bold text-lg md:text-2xl transition-all duration-500 group-hover:scale-105 ${getLogoTextColorClass(isScrolled, isHomePage)}`}>
          <span>CPSCS</span>
          <span className="text-cpscs-gold"> Alumni</span>
        </div>
      )}
    </Link>
  );
};

export default NavbarLogo;
