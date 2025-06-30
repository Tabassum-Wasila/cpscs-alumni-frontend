
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavbarState = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  // Determine if we're on home page to apply different text colors
  const isHomePage = location.pathname === '/';

  return {
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    isHomePage
  };
};
