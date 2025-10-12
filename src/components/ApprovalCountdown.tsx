
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApprovalCountdownProps {
  isManualApproval: boolean;
  onComplete: () => void;
  onShowLogin: () => void;
}

const ApprovalCountdown: React.FC<ApprovalCountdownProps> = ({ 
  isManualApproval, 
  onComplete, 
  onShowLogin 
}) => {
  const [countdown, setCountdown] = useState(3); // Previously 10 seconds
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [countdown, isComplete, onComplete]);

  if (!isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="w-12 h-12 text-cpscs-blue animate-pulse" />
          </div>
          <CardTitle className="text-xl text-cpscs-blue">
            Processing Your Request
          </CardTitle>
          <CardDescription>
            {/* An admin would check your form and approve your sign up if you are a genuine member. 
            Please check your email for updates. */}
            Please wait while we validate your details and set up your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-3xl font-bold text-cpscs-blue mb-2">
            {countdown}
          </div>
          <div className="text-sm text-gray-600">
            Validating your information...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isManualApproval) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-orange-500" />
          </div>
          <CardTitle className="text-xl text-orange-600">
            Manual Approval Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Please contact an admin to manually approve your sign up request. 
            We are sorry for the inconvenience.
          </p>
          <Button 
            onClick={() => window.location.href = '/contact'} 
            className="w-full"
            variant="outline"
          >
            Contact Admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <CardTitle className="text-xl text-green-600">
          Welcome to CPSCS Alumni Community!
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 mb-6">
          Your sign up request has been approved. Welcome to the CPSCS Alumni Community.
        </p>
        <Button onClick={onShowLogin} className="w-full bg-cpscs-blue hover:bg-blue-700">
          Login to Your Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApprovalCountdown;
