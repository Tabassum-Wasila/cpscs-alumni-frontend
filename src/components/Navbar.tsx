
import React from 'react';
import { useNavbarState } from '@/hooks/useNavbarState';
import NavbarLogo from './navbar/NavbarLogo';
import DesktopNavigation from './navbar/DesktopNavigation';
import MobileNavigation from './navbar/MobileNavigation';
import AuthButtons from './navbar/AuthButtons';

const Navbar = () => {
  const { isScrolled, isHomePage, isNavbarVisible } = useNavbarState();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'bg-white/90 dark:bg-cpscs-dark/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <NavbarLogo isScrolled={isScrolled} isHomePage={isHomePage} />
          <DesktopNavigation isScrolled={isScrolled} isHomePage={isHomePage} />
          <AuthButtons isScrolled={isScrolled} isHomePage={isHomePage} />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Top Row: Logo and Auth Buttons */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-shrink-0">
              <NavbarLogo isScrolled={isScrolled} isHomePage={isHomePage} />
            </div>
            <div className="flex-shrink-0">
              <AuthButtons isMobile={true} isScrolled={isScrolled} isHomePage={isHomePage} />
            </div>
          </div>
          
          {/* Mobile Navigation Pills */}
          <MobileNavigation isScrolled={isScrolled} isHomePage={isHomePage} />
        </div>
      </div>
      
      {/* Mobile spacer to prevent content overlap */}
      <div className="lg:hidden h-4"></div>
    </nav>
  );
};

export default Navbar;
