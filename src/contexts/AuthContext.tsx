
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService, LoginCredentials } from '@/services/authService';
import { AlumniService, SearchFilters } from '@/services/alumniService';
import { UserService, UserProfile } from '@/services/userService';

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
  proofDocument?: string;
}

export type User = {
  id: string;
  fullName: string;
  email: string;
  sscYear: string;
  hscYear?: string;
  attendanceFromYear?: string;
  attendanceToYear?: string;
  profilePhoto?: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  isDemoUser?: boolean;
  profile?: UserProfile;
  hasMembership: boolean;
  dateJoined?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  socialProfileLink?: string;
  countryCode?: string;
  phoneNumber?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  checkEmailExists: (email: string) => Promise<boolean>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  searchAlumni: (query: string, filters?: Record<string, any>) => Promise<User[]>;
  requestMentorship: (mentorId: string, message: string) => Promise<boolean>;
  toggleContactVisibility: (contactType: 'email' | 'phone', userId: string) => Promise<void>;
  getAdminSettings: () => { manualApproval: boolean };
  setAdminSettings: (settings: { manualApproval: boolean }) => Promise<void>;
  getPendingApprovals: () => any[];
  approveUser: (userId: string) => Promise<boolean>;
  rejectUser: (userId: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      const result = await AuthService.login({ email, password });
      if (result) {
        setUser(result.user);
        return { success: true, user: result.user };
      }
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      const result = await AuthService.register({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        passwordConfirmation: userData.password, // Use the same password for confirmation
        sscYear: userData.sscYear,
        hscYear: userData.hscYear,
        attendanceFromYear: userData.attendanceFromYear,
        attendanceToYear: userData.attendanceToYear,
        countryCode: userData.countryCode,
        phoneNumber: userData.phoneNumber,
        socialProfileLink: userData.socialProfileLink,
        profilePhoto: userData.profilePhoto,
        proofDocument: userData.proofDocument,
      });
      
      if (result) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = await UserService.updateProfile(user.id, profileData);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    // This will need to be implemented as an API endpoint
    // For now, return false as a placeholder
    console.log('checkEmailExists not implemented for API yet:', email);
    return false;
  };
  
  const searchAlumni = async (query: string, filters?: Record<string, any>): Promise<User[]> => {
    const searchFilters: SearchFilters = {
      batch: filters?.batch,
      profession: filters?.profession,
      location: filters?.location,
      mentorsOnly: filters?.mentorsOnly
    };
    
    return await AlumniService.searchAlumni(query, searchFilters);
  };
  
  const requestMentorship = async (mentorId: string, message: string): Promise<boolean> => {
    if (!user) return false;
    
    return await AlumniService.requestMentorship(
      mentorId, 
      user.id, 
      { name: user.fullName, email: user.email, batch: user.sscYear }, 
      message
    );
  };
  
  const toggleContactVisibility = async (contactType: 'email' | 'phone', userId: string): Promise<void> => {
    if (user) {
      AlumniService.logContactView(contactType, userId, user.id);
    }
  };

  const getAdminSettings = () => {
    return { manualApproval: true };
  };

  const setAdminSettings = async (settings: { manualApproval: boolean }) => {
    // This will need to be implemented as an API endpoint
    console.log('setAdminSettings not implemented for API yet:', settings);
  };

  const getPendingApprovals = () => {
    return [];
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    // This will need to be implemented as an API endpoint
    console.log('approveUser not implemented for API yet:', userId);
    return true;
  };

  const rejectUser = async (userId: string): Promise<boolean> => {
    // This will need to be implemented as an API endpoint
    console.log('rejectUser not implemented for API yet:', userId);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkEmailExists,
        updateUserProfile,
        searchAlumni,
        requestMentorship,
        toggleContactVisibility,
        getAdminSettings,
        setAdminSettings,
        getPendingApprovals,
        approveUser,
        rejectUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
