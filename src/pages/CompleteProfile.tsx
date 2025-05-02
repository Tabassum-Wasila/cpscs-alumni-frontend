
import React from 'react';
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const CompleteProfile = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light flex items-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-cpscs-gold shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCheck className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-cpscs-blue">Registration Successful!</CardTitle>
              <CardDescription className="text-lg mt-2">
                {user?.fullName ? `Thank you, ${user.fullName.split(' ')[0]}!` : 'Thank you!'} Your registration for the Grand Alumni Reunion 2025 is confirmed!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pb-8 text-center">
              <div className="bg-cpscs-light rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-4 text-cpscs-blue">What's Next?</h3>
                <p className="mb-4">
                  Your registration is confirmed and your payment has been received. We've sent a confirmation 
                  email with all the details to your registered email address.
                </p>
                <p>
                  Now, we invite you to complete your alumni profile so that other alumni can connect with you 
                  and stay in touch even after the reunion.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Link to="/alumni-directory" className="w-full">
                <Button className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700 hover:from-blue-700 hover:to-cpscs-blue py-6">
                  Complete My Alumni Profile
                </Button>
              </Link>
              
              <Link to="/" className="w-full">
                <Button variant="outline" className="w-full">
                  Return to Homepage
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CompleteProfile;
