import { OTPService } from './otpService';

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  sscYear: string;
  hscYear: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  sscYear: string;
  hscYear: string;
  attendanceFromYear: string;
  attendanceToYear: string;
  countryCode: string;
  phoneNumber: string;
  profilePhoto: string;
  socialProfileLink: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  sscYear: string;
  hscYear: string;
  dateJoined: string;
  hasMembership: boolean;
  isAuthenticated: boolean;
  profile: UserProfile;
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

  static isLoggedIn(): boolean {
    return !!AuthService.getCurrentUser();
  }

  static updateUser(user: User): void {
    localStorage.setItem('cpscs_user', JSON.stringify(user));
  }

  static updateStoredUser(updatedUser: User): boolean {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
      const userIndex = storedUsers.findIndex((user: User) => user.id === updatedUser.id);

      if (userIndex !== -1) {
        storedUsers[userIndex] = updatedUser;
        localStorage.setItem('cpscs_users', JSON.stringify(storedUsers));
        AuthService.updateUser(updatedUser);
        return true;
      } else {
        console.warn('User not found in stored users.');
        return false;
      }
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
      password: userData.password,
      sscYear: userData.sscYear,
      hscYear: userData.hscYear,
      dateJoined: new Date().toISOString(),
      hasMembership: false,
      isAuthenticated: false,
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
        socialLinks: {},
        willingToMentor: false,
        mentorshipAreas: [],
        education: [],
        workExperience: []
      }
    };

    let users = [];
    const storedUsers = localStorage.getItem('cpscs_users');
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }

    users.push(newUser);
    localStorage.setItem('cpscs_users', JSON.stringify(users));
    AuthService.updateUser(newUser);
    return newUser;
  }

  static logout(): void {
    localStorage.removeItem('cpscs_user');
  }

  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
      const user = storedUsers.find((u: User) => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        const authenticatedUser = { ...user, isAuthenticated: true };
        AuthService.updateUser(authenticatedUser);
        return authenticatedUser;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  static async signup(userData: SignupData): Promise<User | null> {
    try {
      const users = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
      const existingUser = users.find((u: User) => u.email === userData.email);
      
      if (existingUser) {
        return null; // User already exists
      }

      const newUser = AuthService.createUser(userData);
      return { ...newUser, isAuthenticated: true };
    } catch (error) {
      console.error("Signup error:", error);
      return null;
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const users = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
      return users.some((u: User) => u.email === email);
    } catch (error) {
      console.error("Check email error:", error);
      return false;
    }
  }

  static async sendPasswordResetOTP(email: string): Promise<{ success: boolean; message: string }> {
    return await OTPService.sendPasswordResetOTP(email);
  }

  static async verifyPasswordResetOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const isValid = OTPService.verifyOTP(email, otp, 'password-reset');
    return {
      success: isValid,
      message: isValid ? 'OTP verified successfully' : 'Invalid or expired OTP'
    };
  }

  static async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // First verify the OTP
      const otpValid = OTPService.verifyOTP(email, otp, 'password-reset');
      if (!otpValid) {
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }

      // Update password
      const users = JSON.parse(localStorage.getItem('cpscs_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('cpscs_users', JSON.stringify(users));
      
      // Remove the used OTP
      OTPService.removeOTP(email, 'password-reset');
      
      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: 'Failed to reset password'
      };
    }
  }

  static async getAdminSettings(): Promise<any> {
    // Mock admin settings
    return { approvalRequired: true };
  }

  static async setAdminSettings(settings: any): Promise<boolean> {
    // Mock admin settings update
    console.log("Admin settings updated:", settings);
    return true;
  }

  static async getPendingApprovals(): Promise<User[]> {
    // Mock pending approvals
    return [];
  }

  static async approveUser(userId: string): Promise<boolean> {
    // Mock user approval
    console.log("User approved:", userId);
    return true;
  }

  static async rejectUser(userId: string): Promise<boolean> {
    // Mock user rejection
    console.log("User rejected:", userId);
    return true;
  }
}
