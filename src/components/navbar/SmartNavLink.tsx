import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SmartNavLinkProps {
  to: string;
  protectedRoute?: boolean;
  previewRoute?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SmartNavLink: React.FC<SmartNavLinkProps> = ({ 
  to, 
  protectedRoute = false, 
  previewRoute, 
  children, 
  className,
  style 
}) => {
  const { isAuthenticated } = useAuth();
  
  // If it's a protected route and user is not authenticated, use preview route
  const targetRoute = protectedRoute && !isAuthenticated && previewRoute 
    ? previewRoute 
    : to;
  
  return (
    <Link to={targetRoute} className={className} style={style}>
      {children}
    </Link>
  );
};

export default SmartNavLink;