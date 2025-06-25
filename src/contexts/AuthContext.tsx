
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService, LoginCredentials, SignupData } from '@/services/authService';
import { AlumniService, SearchFilters } from '@/services/alumniService';
import { UserService, UserProfile } from '@/services/userService';

export type User = {
  id: string;
  fullName: string;
  email: string;
  sscYear: string;
  hscYear?: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  checkEmailExists: (email: string) => Promise<boolean>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  searchAlumni: (query: string, filters?: Record<string, any>) => Promise<User[]>;
  requestMentorship: (mentorId: string, message: string) => Promise<boolean>;
  toggleContactVisibility: (contactType: 'email' | 'phone', userId: string) => Promise<void>;
  getAdminSettings: () => { manualApproval: boolean };
  setAdminSettings: (settings: { manualApproval: boolean }) => void;
  getPendingApprovals: () => any[];
  approveUser: (userId: string) => boolean;
  rejectUser: (userId: string) => boolean;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = await AuthService.login({ email, password });
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const newUser = await AuthService.signup(userData);
    if (newUser) {
      setUser(newUser);
      return true;
    }
    return false;
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = await UserService.updateProfile(user.id, profileData);
    if (updatedUser) {
      setUser(updatedUser);
      return true;
    }
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

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    return await AuthService.checkEmailExists(email);
  };

  const getAdminSettings = () => {
    return AuthService.getAdminSettings();
  };

  const setAdminSettings = (settings: { manualApproval: boolean }) => {
    AuthService.setAdminSettings(settings);
  };

  const getPendingApprovals = () => {
    return AuthService.getPendingApprovals();
  };

  const approveUser = (userId: string): boolean => {
    return AuthService.approveUser(userId);
  };

  const rejectUser = (userId: string): boolean => {
    return AuthService.rejectUser(userId);
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
