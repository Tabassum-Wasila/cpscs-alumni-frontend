import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

interface PasswordResetSuccessStepProps {
  onClose: () => void;
}

const PasswordResetSuccessStep: React.FC<PasswordResetSuccessStepProps> = ({ onClose }) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Password Reset Complete!</h3>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now log in with your new password.
        </p>
      </div>

      <Button 
        onClick={onClose}
        className="w-full bg-gradient-to-r from-cpscs-blue to-blue-700"
      >
        Continue to Login
      </Button>
    </div>
  );
};

export default PasswordResetSuccessStep;