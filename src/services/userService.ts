
import { User } from '@/contexts/AuthContext';
import { AuthService } from './authService';

export type UserProfile = {
  profilePicture?: string;
  bio?: string;
  profession?: string;
  organization?: string;
  organizationWebsite?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  permanentAddress?: string;
  sameAsCurrentAddress?: boolean;
  phoneNumber?: string;
  showPhone?: boolean;
  dateOfBirth?: string;
  expertise?: string[];
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  willingToMentor?: boolean;
  mentorshipAreas?: string[];
  aboutMe?: string;
  hallOfFameOptIn?: boolean;
  hallOfFameBio?: string;
  education?: EducationEntry[];
  workExperience?: WorkExperience[];
  profileCompletionScore?: number;
};

export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
  department?: string;
  isDefault?: boolean;
};

export type WorkExperience = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
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
      profile?.phoneNumber,
      (profile?.expertise && profile.expertise.length > 0)
    ];
    
    const socialCount = Object.values(profile?.socialLinks || {}).filter(Boolean).length;
    const hasSocialLinks = socialCount > 0;
    
    return requiredFields.every(field => !!field) && hasSocialLinks;
  }

  static calculateProfileCompletion(user: User): number {
    const { profile } = user;
    const totalFields = 10;
    let completedFields = 0;

    // Required fields (8 fields = 80%)
    if (profile?.profilePicture) completedFields += 1;
    if (profile?.profession) completedFields += 1;
    if (profile?.organization) completedFields += 1;
    if (profile?.city) completedFields += 1;
    if (profile?.country) completedFields += 1;
    if (profile?.bio) completedFields += 1;
    if (profile?.phoneNumber) completedFields += 1;
    if (profile?.expertise && profile.expertise.length > 0) completedFields += 1;

    // Social links (1 field = 10%)
    const socialCount = Object.values(profile?.socialLinks || {}).filter(Boolean).length;
    if (socialCount > 0) completedFields += 1;

    // Additional optional field (1 field = 10%)
    if (profile?.dateOfBirth) completedFields += 1;

    return Math.round((completedFields / totalFields) * 100);
  }

  static getMissingFields(user: User): string[] {
    const { profile } = user;
    const missing: string[] = [];

    if (!profile?.profilePicture) missing.push('Profile Picture');
    if (!profile?.profession) missing.push('Profession');
    if (!profile?.organization) missing.push('Organization');
    if (!profile?.city) missing.push('City');
    if (!profile?.country) missing.push('Country');
    if (!profile?.bio) missing.push('Bio');
    if (!profile?.phoneNumber) missing.push('Phone Number');
    if (!profile?.expertise || profile.expertise.length === 0) missing.push('Expertise');

    const socialCount = Object.values(profile?.socialLinks || {}).filter(Boolean).length;
    if (socialCount === 0) missing.push('At least one Social Link');

    return missing;
  }

  static generateUserSlug(user: User): string {
    const name = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const ssc = user.sscYear;
    const city = user.profile?.city?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown';
    return `${name}-${ssc}-${city}`;
  }
}
