
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfilePage from "@/components/alumni/ProfilePage";

const CompleteProfile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return path from location state
  const from = location.state?.from || "/alumni-directory";
  
  // Check if profile is complete
  const isProfileComplete = () => {
    if (!user || !user.profile) return false;
    
    const { profile } = user;
    const requiredFields = [
      profile.profilePicture,
      profile.profession,
      profile.organization,
      profile.city,
      profile.country,
      profile.bio,
      (profile.expertise && profile.expertise.length > 0)
    ];
    
    return requiredFields.every(field => !!field);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-24 bg-cpscs-light">
        <div className="container mx-auto px-4">
          {isAuthenticated ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-cpscs-blue mb-2">Complete Your Profile</h1>
                <p className="text-gray-600 mb-4">
                  To access the Alumni Directory, please complete all required fields in your profile.
                </p>
                
                {isProfileComplete() && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                      Your profile is complete! You can now access the Alumni Directory.
                    </p>
                    <Button 
                      className="mt-3 bg-cpscs-blue hover:bg-blue-700"
                      onClick={() => navigate(from)}
                    >
                      Go to Alumni Directory
                    </Button>
                  </div>
                )}
              </div>
              
              <ProfilePage />
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-10">
              <h1 className="text-2xl font-bold text-cpscs-blue mb-4">Authentication Required</h1>
              <p className="mb-6 text-gray-600">
                You need to be logged in to complete your profile.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate("/login")} className="bg-cpscs-blue hover:bg-blue-700">
                  Log In
                </Button>
                <Button onClick={() => navigate("/signup")} variant="outline">
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CompleteProfile;
