
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
    if (!isAuthenticated && location.pathname !== '/alumni-directory') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast, location.pathname]);

  if (!isAuthenticated) {
    // For alumni directory, show preview page instead of redirecting to login
    if (location.pathname === '/alumni-directory') {
      return <Navigate to="/alumni-directory-preview" replace />;
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isAuthenticated && user) {
    const completionPercentage = UserService.calculateProfileCompletion(user);
    
    if (completionPercentage < 80) {
      const missingFields = UserService.getMissingFields(user);
      toast({
        title: "Complete Your Profile (80% Required)",
        description: `You need ${80 - completionPercentage}% more completion. Missing: ${missingFields.slice(0, 2).join(', ')}${missingFields.length > 2 ? ` and ${missingFields.length - 2} more` : ''}`,
        variant: "destructive",
      });
      return <Navigate to="/complete-profile" state={{ from: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
