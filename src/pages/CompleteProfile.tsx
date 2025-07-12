
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/userService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfilePage from "@/components/alumni/ProfilePage";

const CompleteProfile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return path from location state
  const from = location.state?.from || "/alumni-directory";
  
  const getProfileCompletion = (): { percentage: number; isComplete: boolean } => {
    if (!user) return { percentage: 0, isComplete: false };
    const percentage = UserService.calculateProfileCompletion(user);
    return { percentage, isComplete: percentage >= 80 };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-40 lg:py-24 bg-cpscs-light">
        <div className="container mx-auto px-4">
          {isAuthenticated ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {(() => {
                  const { percentage, isComplete } = getProfileCompletion();
                  
                  if (isComplete) {
                    return (
                      <>
                        <h1 className="text-2xl font-bold text-green-800 mb-2">Profile Complete! 🎉</h1>
                        <p className="text-green-700 mb-4">
                          Your profile is {percentage}% complete. You can now access the Alumni Directory.
                        </p>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => navigate(from)}
                        >
                          Go to Alumni Directory
                        </Button>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <h1 className="text-2xl font-bold text-cpscs-blue mb-2">
                          Complete Your Profile ({percentage}%)
                        </h1>
                        <p className="text-gray-600 mb-4">
                          You need 80% completion to access the Alumni Directory. 
                          Fill in the missing fields below to unlock full access.
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div 
                            className="bg-cpscs-blue h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </>
                    );
                  }
                })()}
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
