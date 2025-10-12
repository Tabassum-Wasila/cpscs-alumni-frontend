
import { User } from '@/contexts/AuthContext';
import { AuthService } from './authService';
import { API_CONFIG, getApiUrl, getAuthHeaders, getMultipartHeaders } from '../config/api';

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
  countryCode?: string; 
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

export interface ProfileCompletionStatus {
  profileCompletionScore: number;
  missingFields: string[];
  completedSections: {
    basicInfo: boolean;
    contactInfo: boolean;
    professionalInfo: boolean;
    socialLinks: boolean;
    mentorship: boolean;
  };
}

export class UserService {
  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE(userId)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            return UserService.getUserProfile(userId);
          }
        }
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      // handle profile picture URL by adding backend URL if it's a relative path
      if (data.user && data.user.profile && data.user.profile.profilePicture && !data.user.profile.profilePicture.startsWith('http')) {
        data.user.profile.profilePicture = `${API_CONFIG.BACKEND_URL}${data.user.profile.profilePicture}`;
      }
      console.log(data.user.profile.profilePicture)
      return data.user;
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<User | null> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PROFILE(userId)), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            return UserService.updateProfile(userId, profileData);
          }
        }
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update current user in local storage if it's the same user
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        AuthService.setCurrentUser(data.user);
      }
      
      return data.user;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  // Get profile completion status
  static async getProfileCompletionStatus(userId: string): Promise<ProfileCompletionStatus> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMPLETION_STATUS(userId)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            return UserService.getProfileCompletionStatus(userId);
          }
        }
        throw new Error('Failed to fetch completion status');
      }

      return await response.json();
    } catch (error) {
      console.error("Get completion status error:", error);
      throw error;
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_PROFILE_PICTURE(userId)), {
        method: 'POST',
        headers: getMultipartHeaders(token),
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            return UserService.uploadProfilePicture(userId, file);
          }
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }

      const data = await response.json();
      return data.profilePicture;
    } catch (error) {
      console.error("Upload profile picture error:", error);
      throw error;
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(userId: string): Promise<void> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DELETE_PROFILE_PICTURE(userId)), {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            return UserService.deleteProfilePicture(userId);
          }
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete profile picture');
      }
    } catch (error) {
      console.error("Delete profile picture error:", error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility (using local calculations)
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
