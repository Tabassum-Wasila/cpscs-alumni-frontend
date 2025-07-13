import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Star } from 'lucide-react';
import { UserProfile, UserService } from '@/services/userService';
import { cn } from '@/lib/utils';

interface ProfileProgressProps {
  profile?: UserProfile;
  className?: string;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ profile, className }) => {
  const calculateCompletionScore = () => {
    if (!profile) return 0;
    
    // Create a temporary user object to use UserService calculation
    const tempUser = {
      id: '',
      fullName: '',
      email: '',
      sscYear: '2000',
      hscYear: '2002',
      isAuthenticated: true,
      hasMembership: false,
      profile: profile
    };
    
    return UserService.calculateProfileCompletion(tempUser);
  };

  const getRequiredFields = () => {
    if (!profile) return [];
    
    // Create a temporary user object to use UserService calculation
    const tempUser = {
      id: '',
      fullName: '',
      email: '',
      sscYear: '2000',
      hscYear: '2002',
      isAuthenticated: true,
      hasMembership: false,
      profile: profile
    };
    
    return UserService.getMissingFields(tempUser);
  };

  const completionScore = calculateCompletionScore();
  const missingFields = getRequiredFields();
  const isProfileComplete = missingFields.length === 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn("space-y-4 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Profile Completion
        </h3>
        <Badge 
          variant={isProfileComplete ? "default" : "secondary"}
          className={cn(
            "font-medium",
            isProfileComplete && "bg-green-100 text-green-800 border-green-300"
          )}
        >
          {completionScore}%
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className={cn("font-medium", getScoreColor(completionScore))}>
            {completionScore}/100
          </span>
        </div>
        <Progress 
          value={completionScore} 
          className="h-3 bg-gray-200"
        />
      </div>

      {isProfileComplete ? (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">
            Profile Complete! You can now access the Alumni Directory.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Complete your profile to access the Alumni Directory
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Missing required fields:</p>
            <div className="flex flex-wrap gap-1">
              {missingFields.map((field) => (
                <Badge key={field} variant="outline" className="text-xs border-red-200 text-red-700">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {completionScore >= 60 && completionScore < 100 && (
        <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-800 mb-1">Great progress! 🎉</p>
          <p className="text-blue-700">
            Add more details like work experience, education history, or a detailed "About Me" section to reach 100%.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileProgress;