
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { UserService } from "@/services/userService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the Alumni Directory",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isAuthenticated && user) {
    const isProfileComplete = UserService.isProfileComplete(user);
    
    if (!isProfileComplete) {
      toast({
        title: "Complete Your Profile",
        description: "Please complete all required fields in your profile to access the Alumni Directory",
      });
      return <Navigate to="/complete-profile" state={{ from: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
