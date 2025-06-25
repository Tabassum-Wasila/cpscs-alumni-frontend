
import { User } from '@/contexts/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends Partial<User> {
  password: string;
  socialProfileLink?: string;
  proofDocument?: File;
  countryCode?: string;
  phoneNumber?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export class AuthService {
  private static USERS_KEY = 'cpscs_users';
  private static CURRENT_USER_KEY = 'cpscs_user';
  private static ADMIN_SETTINGS_KEY = 'cpscs_admin_settings';

  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const users = this.getStoredUsers();
      const user = users.find((u: any) => u.email === credentials.email);
      
      if (user && user.password === credentials.password) {
        // Check if user is approved
        if (user.approvalStatus === 'pending') {
          return null; // User not approved yet
        }
        
        const { password: _, ...userWithoutPassword } = user;
        const authUser = {
          ...userWithoutPassword,
          isAuthenticated: true
        };
        
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
        return authUser;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  static async signup(userData: SignupData): Promise<User | null> {
    try {
      const userId = `user_${Date.now()}`;
      const adminSettings = this.getAdminSettings();
      
      const newUser = {
        id: userId,
        fullName: userData.fullName || "",
        email: userData.email || "",
        sscYear: userData.sscYear || "",
        hscYear: userData.hscYear || "",
        password: userData.password,
        hasMembership: true,
        dateJoined: new Date().toISOString(),
        approvalStatus: adminSettings.manualApproval ? 'pending' : 'approved',
        socialProfileLink: userData.socialProfileLink || "",
        countryCode: userData.countryCode || "",
        phoneNumber: userData.phoneNumber || "",
        profile: {
          profilePicture: "",
          bio: "",
          profession: "",
          organization: "",
          city: "",
          country: "",
          phoneNumber: userData.phoneNumber || "",
          showPhone: false,
          expertise: [],
          socialLinks: {},
          willingToMentor: false,
          mentorshipAreas: []
        }
      };

      const users = this.getStoredUsers();
      users.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      // Only set current user if automatically approved
      if (newUser.approvalStatus === 'approved') {
        const { password: _, ...userWithoutPassword } = newUser;
        const authUser = {
          ...userWithoutPassword,
          isAuthenticated: true
        };
        
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
        return authUser;
      }
      
      return null; // User needs approval
    } catch (error) {
      console.error("Signup error:", error);
      return null;
    }
  }

  static getCurrentUser(): User | null {
    try {
      const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    const users = this.getStoredUsers();
    return users.some((user: any) => user.email === email);
  }

  static getAdminSettings(): { manualApproval: boolean } {
    try {
      const settings = localStorage.getItem(this.ADMIN_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : { manualApproval: false };
    } catch (error) {
      console.error("Get admin settings error:", error);
      return { manualApproval: false };
    }
  }

  static setAdminSettings(settings: { manualApproval: boolean }): void {
    localStorage.setItem(this.ADMIN_SETTINGS_KEY, JSON.stringify(settings));
  }

  static getPendingApprovals(): any[] {
    const users = this.getStoredUsers();
    return users.filter((user: any) => user.approvalStatus === 'pending');
  }

  static approveUser(userId: string): boolean {
    try {
      const users = this.getStoredUsers();
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].approvalStatus = 'approved';
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Approve user error:", error);
      return false;
    }
  }

  static rejectUser(userId: string): boolean {
    try {
      const users = this.getStoredUsers();
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].approvalStatus = 'rejected';
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Reject user error:", error);
      return false;
    }
  }

  private static getStoredUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]");
    } catch (error) {
      console.error("Error getting stored users:", error);
      return [];
    }
  }

  static updateStoredUser(updatedUser: User): boolean {
    try {
      const users = this.getStoredUsers();
      const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
      
      if (userIndex !== -1) {
        const { password } = users[userIndex];
        users[userIndex] = { ...updatedUser, password };
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update stored user error:", error);
      return false;
    }
  }
}
