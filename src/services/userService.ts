
import { User } from '@/contexts/AuthContext';
import { AuthService } from './authService';

export type UserProfile = {
  profilePicture?: string;
  bio?: string;
  profession?: string;
  organization?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  showPhone?: boolean;
  expertise?: string[];
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  willingToMentor?: boolean;
  mentorshipAreas?: string[];
};

export class UserService {
  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<User | null> {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || currentUser.id !== userId) return null;
      
      const updatedUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          ...profileData
        }
      };
      
      const success = AuthService.updateStoredUser(updatedUser);
      return success ? updatedUser : null;
    } catch (error) {
      console.error("Profile update error:", error);
      return null;
    }
  }

  static isProfileComplete(user: User): boolean {
    const { profile } = user;
    const requiredFields = [
      profile?.profilePicture,
      profile?.profession,
      profile?.organization,
      profile?.city,
      profile?.country,
      profile?.bio,
      (profile?.expertise && profile.expertise.length > 0)
    ];
    
    return requiredFields.every(field => !!field);
  }
}
