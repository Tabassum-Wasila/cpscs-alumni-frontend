
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavbarState = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle desktop scroll behavior
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Handle mobile navbar visibility
      if (window.innerWidth < 1024) { // Mobile/tablet breakpoint
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past initial scroll threshold
          setIsNavbarVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsNavbarVisible(true);
        }
      } else {
        // Always visible on desktop
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Reset navbar visibility on route change
  useEffect(() => {
    setIsNavbarVisible(true);
  }, [location.pathname]);

  // Determine if we're on home page to apply different text colors
  const isHomePage = location.pathname === '/';

  return {
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    isHomePage,
    isNavbarVisible
  };
};
