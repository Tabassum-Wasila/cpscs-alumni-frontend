
import React from 'react';
import { Menu, X } from "lucide-react";
import { useNavbarState } from '@/hooks/useNavbarState';
import { getTextColorClass } from '@/utils/navbarUtils';
import NavbarLogo from './navbar/NavbarLogo';
import DesktopNavigation from './navbar/DesktopNavigation';
import MobileNavigation from './navbar/MobileNavigation';
import AuthButtons from './navbar/AuthButtons';

const Navbar = () => {
  const { isScrolled, mobileMenuOpen, setMobileMenuOpen } = useNavbarState();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 dark:bg-cpscs-dark/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-3">
          {/* Mobile Layout: Logo | Auth Buttons | Hamburger */}
          <div className="flex md:hidden items-center justify-between">
            <div className="flex-shrink-0">
              <NavbarLogo isScrolled={isScrolled} />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <AuthButtons />
              </div>
              
              <button 
                className={`p-2 focus:outline-none transition-all duration-500 hover:scale-110 ${getTextColorClass(isScrolled)}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-0 hover:rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <NavbarLogo isScrolled={isScrolled} />
            <DesktopNavigation isScrolled={isScrolled} />
            <AuthButtons />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <MobileNavigation 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;
