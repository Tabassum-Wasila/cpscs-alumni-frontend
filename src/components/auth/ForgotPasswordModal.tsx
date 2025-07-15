import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmailVerificationStep from './EmailVerificationStep';
import OTPVerificationStep from './OTPVerificationStep';
import NewPasswordStep from './NewPasswordStep';
import PasswordResetSuccessStep from './PasswordResetSuccessStep';

type Step = 'email' | 'otp' | 'password' | 'success';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleStepChange = (step: Step, data?: any) => {
    if (step === 'otp' && data?.email) {
      setEmail(data.email);
    }
    if (step === 'password' && data?.otp) {
      setOtp(data.otp);
    }
    setCurrentStep(step);
  };

  const handleClose = () => {
    setCurrentStep('email');
    setEmail('');
    setOtp('');
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Reset Password';
      case 'otp':
        return 'Verify Email';
      case 'password':
        return 'Create New Password';
      case 'success':
        return 'Password Reset Successful';
      default:
        return 'Reset Password';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'email':
        return 'Enter your email address to receive a password reset code';
      case 'otp':
        return `We've sent a 6-digit code to ${email}`;
      case 'password':
        return 'Enter your new password';
      case 'success':
        return 'Your password has been reset successfully';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'email' && (
          <EmailVerificationStep 
            onNext={(email) => handleStepChange('otp', { email })}
            onCancel={handleClose}
          />
        )}

        {currentStep === 'otp' && (
          <OTPVerificationStep 
            email={email}
            onNext={(otp) => handleStepChange('password', { otp })}
            onBack={() => handleStepChange('email')}
          />
        )}

        {currentStep === 'password' && (
          <NewPasswordStep 
            email={email}
            otp={otp}
            onNext={() => handleStepChange('success')}
            onBack={() => handleStepChange('otp')}
          />
        )}

        {currentStep === 'success' && (
          <PasswordResetSuccessStep 
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;