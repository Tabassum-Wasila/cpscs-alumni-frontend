
import { User } from '@/contexts/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends Partial<User> {
  password: string;
}

export class AuthService {
  private static USERS_KEY = 'cpscs_users';
  private static CURRENT_USER_KEY = 'cpscs_user';

  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const users = this.getStoredUsers();
      const user = users.find((u: any) => u.email === credentials.email);
      
      if (user && user.password === credentials.password) {
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
      
      const newUser = {
        id: userId,
        fullName: userData.fullName || "",
        email: userData.email || "",
        sscYear: userData.sscYear || "",
        hscYear: userData.hscYear || "",
        password: userData.password,
        hasMembership: true,
        dateJoined: new Date().toISOString(),
        profile: {
          profilePicture: "",
          bio: "",
          profession: "",
          organization: "",
          city: "",
          country: "",
          phoneNumber: "",
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
      
      const { password: _, ...userWithoutPassword } = newUser;
      const authUser = {
        ...userWithoutPassword,
        isAuthenticated: true
      };
      
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
      return authUser;
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
