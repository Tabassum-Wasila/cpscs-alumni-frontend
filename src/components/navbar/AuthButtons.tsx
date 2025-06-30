
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthButtonsProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false, closeMobileMenu }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (closeMobileMenu) closeMobileMenu();
  };

  if (isAuthenticated) {
    if (isMobile) {
      return (
        <div className="flex flex-col space-y-2">
          <Link 
            to="/complete-profile" 
            className="py-2 border-b border-gray-100 dark:border-gray-800"
            onClick={closeMobileMenu}
          >
            My Profile
          </Link>
          <Link 
            to="/alumni-directory" 
            className="py-2 border-b border-gray-100 dark:border-gray-800"
            onClick={closeMobileMenu}
          >
            Alumni Directory
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Log out</span>
          </Button>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cpscs-gold/25"
          >
            <User size={16} className="transition-transform duration-300 group-hover:rotate-12" />
            <span>{user?.fullName?.split(' ')[0] || 'Account'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/complete-profile" className="w-full">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/alumni-directory" className="w-full">Alumni Directory</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-white transition-all duration-300"
          asChild
        >
          <Link to="/login" onClick={closeMobileMenu}>
            <User size={16} />
            <span>Login</span>
          </Link>
        </Button>
        <Button 
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 group"
          asChild
        >
          <Link to="/signup" onClick={closeMobileMenu}>
            <Sparkles size={16} className="animate-pulse" />
            <span>Join Alumni</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
        <Link 
          to="/register" 
          className="py-2 border-b border-gray-100 dark:border-gray-800 text-center text-cpscs-blue hover:text-cpscs-gold transition-colors"
          onClick={closeMobileMenu}
        >
          Register for Reunion
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="flex items-center gap-2 border-cpscs-gold text-cpscs-gold hover:bg-cpscs-gold hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-cpscs-gold/20 group"
        asChild
      >
        <Link to="/login">
          <User size={16} className="transition-transform duration-300 group-hover:scale-110" />
          <span>Login</span>
        </Link>
      </Button>
      <Button
        className="flex items-center gap-2 bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 group relative overflow-hidden"
        asChild
      >
        <Link to="/signup">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Sparkles size={16} className="animate-pulse relative z-10" />
          <span className="relative z-10">Join Alumni</span>
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
        </Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
