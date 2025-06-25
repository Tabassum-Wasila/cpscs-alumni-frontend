
import React from 'react';
import { Check, X } from 'lucide-react';

interface ConfirmPasswordFeedbackProps {
  password: string;
  confirmPassword: string;
}

const ConfirmPasswordFeedback: React.FC<ConfirmPasswordFeedbackProps> = ({ 
  password, 
  confirmPassword 
}) => {
  if (!confirmPassword) return null;

  const isMatch = password === confirmPassword;

  return (
    <div className="absolute right-3 top-2.5">
      {isMatch ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
};

export default ConfirmPasswordFeedback;
