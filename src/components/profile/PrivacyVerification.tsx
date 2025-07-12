import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, AlertTriangle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PrivacyVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  contactType: 'email' | 'phone';
  userName: string;
}

const PrivacyVerification: React.FC<PrivacyVerificationProps> = ({
  isOpen,
  onClose,
  onVerified,
  contactType,
  userName
}) => {
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Generate simple captcha on component mount
  React.useEffect(() => {
    generateCaptcha();
  }, [isOpen]);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput('');
    setError('');
  };

  const handleVerify = () => {
    if (captchaInput.toUpperCase() === captchaCode) {
      setIsVerified(true);
      setTimeout(() => {
        onVerified();
        handleClose();
      }, 1000);
    } else {
      setError('Incorrect verification code. Please try again.');
      generateCaptcha();
    }
  };

  const handleClose = () => {
    setCaptchaInput('');
    setError('');
    setIsVerified(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Privacy Verification Required
          </DialogTitle>
          <DialogDescription>
            You're about to view {userName}'s {contactType} information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy Notice:</strong> Contact information is sensitive personal data. 
              Please use this information respectfully and only for legitimate networking purposes. 
              Unauthorized use or sharing of this information is strictly prohibited.
            </AlertDescription>
          </Alert>

          {!isVerified ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <Label className="text-sm text-gray-600 mb-2 block">
                  Please enter the verification code below:
                </Label>
                <div className="bg-white p-3 rounded border-2 border-dashed border-gray-300 font-mono text-xl tracking-wider text-center mb-3">
                  {captchaCode}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateCaptcha}
                  className="text-xs"
                >
                  Generate New Code
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="captcha">Verification Code</Label>
                <Input
                  id="captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter the code above"
                  className="text-center font-mono tracking-wider"
                  maxLength={5}
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerify} 
                  className="flex-1"
                  disabled={captchaInput.length !== 5}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Verify & View
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Verification Successful!
              </h3>
              <p className="text-sm text-gray-600">
                You can now view the {contactType} information.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyVerification;