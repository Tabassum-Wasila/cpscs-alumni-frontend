
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength level
    if (score <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const { strength, label, color } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex space-x-1 mb-1">
        <div className={`h-1 flex-1 rounded ${strength >= 1 ? color : 'bg-gray-200'}`}></div>
        <div className={`h-1 flex-1 rounded ${strength >= 2 ? color : 'bg-gray-200'}`}></div>
        <div className={`h-1 flex-1 rounded ${strength >= 3 ? color : 'bg-gray-200'}`}></div>
      </div>
      <p className={`text-xs ${color.replace('bg-', 'text-')}`}>{label}</p>
    </div>
  );
};

export default PasswordStrengthIndicator;
