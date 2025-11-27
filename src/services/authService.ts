import { OTPService } from './otpService';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';
import { profile } from 'console';

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  sscYear: string;
  hscYear: string;
  attendanceFromYear: string;
  attendanceToYear: string;
  countryCode: string;
  phoneNumber: string;
  profilePhoto?: string;
  socialProfileLink?: string;
  proofDocument?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  sscYear: string;
  hscYear: string;
  attendanceFromYear?: string;
  attendanceToYear?: string;
  profilePhoto?: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  isDemoUser?: boolean;
  profile?: UserProfile;
  hasMembership: boolean;
  dateJoined: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  socialProfileLink?: string;
  countryCode?: string;
  phoneNumber?: string;
}

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

export class AuthService {
  // Token management
  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  static removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  // User management
  static getCurrentUser(): User | null {
    const userJson = localStorage.getItem('cpscs_user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
      }
    }
    return null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem('cpscs_user', JSON.stringify(user));
  }

  static isLoggedIn(): boolean {
    return !!(AuthService.getCurrentUser() && AuthService.getToken());
  }

  // API Methods
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      AuthService.setToken(data.token);
      AuthService.setCurrentUser(data.user);
      
      return { user: data.user, token: data.token };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async register(userData: SignupFormData): Promise<{ user: User; token: string } | null> {
    try {
      // Transform camelCase to snake_case for API
      const apiData = {
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        ssc_year: userData.sscYear,
        hsc_year: userData.hscYear,
        phone_number: userData.phoneNumber,
        country_code: userData.countryCode,
        profile_photo: userData.profilePhoto,
        social_profile_link: userData.socialProfileLink,
        proof_document: userData.proofDocument,

        // Optional fields that might not be in SignupFormData
        ...(userData.attendanceFromYear && { attendance_from_year: userData.attendanceFromYear }),
        ...(userData.attendanceToYear && { attendance_to_year: userData.attendanceToYear }),
      };

      console.log('Sending registration data:', apiData); // Debug log

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data
      AuthService.setToken(data.token);
      AuthService.setCurrentUser(data.user);
      
      return { user: data.user, token: data.token };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = AuthService.getToken();
      if (token) {
        await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
          method: 'POST',
          headers: getAuthHeaders(token),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      AuthService.removeToken();
      localStorage.removeItem('cpscs_user');
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const token = AuthService.getToken();
      if (!token) return null;

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REFRESH), {
        method: 'POST',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      AuthService.setToken(data.token);
      
      return data.token;
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, logout the user
      await AuthService.logout();
      return null;
    }
  }

  static async getCurrentUserFromAPI(): Promise<User | null> {
    try {
      const token = AuthService.getToken();
      if (!token) return null;

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ME), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            // Retry with new token
            return AuthService.getCurrentUserFromAPI();
          }
        }
        throw new Error('Failed to fetch current user');
      }

      const data = await response.json();
      AuthService.setCurrentUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  // Compatibility wrapper used by UI components expecting a sendPasswordResetOTP method
  static async sendPasswordResetOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await AuthService.forgotPassword(email);
      return { success: true, message: 'If an account exists for that email, a reset link has been sent.' };
    } catch (err: any) {
      // Provide friendly message to UI; backend may return validation error
      const msg = err?.message || 'Failed to send reset link.';
      return { success: false, message: msg };
    }
  }

  // Some UI flows expect an OTP verification step. If the backend doesn't provide a dedicated
  // OTP verification endpoint for password reset, accept the token/otp from the user and proceed.
  // This function mirrors that behavior for backward compatibility.
  static async verifyPasswordResetOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHECK_RESET_OTP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
          const msg = data?.message || 'Please enter the token you received in email.';
          return { success: false, message: msg };
        }
      return { success: true, message: 'Token accepted. Proceed to set a new password.' };
    } catch (error: any) {
      return { success: false, message: error?.message || 'OTP Verification Failed' };
    }
  }

  static async resetPassword(email: string, token: string, password: string, passwordConfirmation: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.RESET_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.message || 'Password reset failed';
        return { success: false, message: msg };
      }

      return { success: true, message: data?.message || 'Password reset successfully.' };
    } catch (error: any) {
      console.error("Reset password error:", error);
      return { success: false, message: error?.message || 'Failed to reset password' };
    }
  }

  // Legacy methods for backward compatibility (will be deprecated)
  static updateUser(user: User): void {
    AuthService.setCurrentUser(user);
  }

  static updateStoredUser(updatedUser: User): boolean {
    try {
      AuthService.setCurrentUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating stored user:', error);
      return false;
    }
  }

  static createUser(userData: SignupData): User {
    const newUser: User = {
      id: crypto.randomUUID(),
      fullName: userData.fullName,
      email: userData.email,
      sscYear: userData.sscYear,
      hscYear: userData.hscYear,
      attendanceFromYear: userData.attendanceFromYear,
      attendanceToYear: userData.attendanceToYear,
      dateJoined: new Date().toISOString(),
      hasMembership: false,
      isAuthenticated: false,
      profilePhoto: userData.profilePhoto || '',
      countryCode: userData.countryCode,
      phoneNumber: userData.phoneNumber,
      socialProfileLink: userData.socialProfileLink,
      profile: {
        profilePicture: userData.profilePhoto || '',
        bio: '',
        profession: '',
        organization: '',
        city: '',
        country: '',
        phoneNumber: userData.phoneNumber || '',
        showPhone: true,
        expertise: [],
        socialLinks: {
          facebook: userData.socialProfileLink?.includes('facebook') ? userData.socialProfileLink : '',
          linkedin: userData.socialProfileLink?.includes('linkedin') ? userData.socialProfileLink : '',
        },
        willingToMentor: false,
        mentorshipAreas: [],
        education: [{
          id: crypto.randomUUID(),
          institution: 'Cantonment Public School and College',
          degree: 'SSC',
          graduationYear: userData.sscYear,
          isDefault: true
        }],
        workExperience: []
      }
    };

    return newUser;
  }
}
