
import React from 'react';
import { useLocation } from "react-router-dom";
import { getLinkColorClass } from '@/utils/navbarUtils';
import { useDynamicNavigation } from '@/hooks/useDynamicNavigation';
import SmartNavLink from './SmartNavLink';

interface DesktopNavigationProps {
  isScrolled: boolean;
  isHomePage: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ isScrolled, isHomePage }) => {
  const location = useLocation();
  const { navLinks } = useDynamicNavigation();

  return (
    <div className="hidden lg:flex items-center space-x-6">
      {navLinks.map((link) => (
        <SmartNavLink
          key={link.path}
          to={link.path}
          protectedRoute={link.path === '/alumni-directory'}
          previewRoute="/alumni-directory-preview"
          className={`text-sm font-medium tracking-wide relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cpscs-gold after:transition-all after:duration-300 hover:after:w-full transition-all duration-500 hover:scale-105 ${
            location.pathname === link.path || (link.path === '/alumni-directory' && location.pathname === '/alumni-directory-preview') ? 'after:w-full' : ''
          } ${getLinkColorClass(isScrolled, isHomePage)}`}
        >
          {link.name}
        </SmartNavLink>
      ))}
    </div>
  );
};

export default DesktopNavigation;
