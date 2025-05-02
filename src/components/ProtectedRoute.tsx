
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if profile is complete (all mandatory fields)
  if (isAuthenticated && user) {
    const { profile } = user;
    const requiredFields = [
      profile?.profilePicture,
      profile?.profession,
      profile?.organization,
      profile?.city,
      profile?.country,
      profile?.bio,
      (profile?.expertise && profile.expertise.length > 0)
    ];
    
    const isProfileComplete = requiredFields.every(field => !!field);
    
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
