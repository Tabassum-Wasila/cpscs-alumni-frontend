import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from '@/services/authService';
import { OTPService } from '@/services/otpService';
import { Loader2, Clock } from 'lucide-react';

interface OTPVerificationStepProps {
  email: string;
  onNext: (otp: string) => void;
  onBack: () => void;
}

const OTPVerificationStep: React.FC<OTPVerificationStepProps> = ({ email, onNext, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial remaining time
    const updateRemainingTime = () => {
      const timeLeft = OTPService.getRemainingTime(email, 'password-reset');
      setRemainingTime(timeLeft);
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [email]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.verifyPasswordResetOTP(email, otp);
      
      if (result.success) {
        toast({
          title: "OTP Verified",
          description: result.message,
        });
        onNext(otp);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        setOtp('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const result = await AuthService.sendPasswordResetOTP(email);
      
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: result.message,
        });
        setOtp('');
        // Reset timer
        setRemainingTime(10);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={setOtp}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {remainingTime > 0 && (
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Code expires in {remainingTime} minute{remainingTime !== 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-muted-foreground">Didn't receive the code?</span>
          <Button
            variant="link"
            onClick={handleResendOTP}
            disabled={isResending}
            className="h-auto p-0 text-cpscs-blue"
          >
            {isResending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Resend
          </Button>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="flex-1 bg-gradient-to-r from-cpscs-blue to-blue-700"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify OTP
        </Button>
      </div>
    </div>
  );
};

export default OTPVerificationStep;