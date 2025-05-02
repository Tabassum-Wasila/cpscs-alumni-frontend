
import React, { createContext, useContext, useState, useEffect } from "react";

type UserProfile = {
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

export type User = {
  id: string;
  fullName: string;
  email: string;
  sscYear: string;
  hscYear?: string;
  isAuthenticated: boolean;
  profile?: UserProfile;
  hasMembership: boolean;
  dateJoined?: string;
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
    // Check if we have a user in localStorage
    const storedUser = localStorage.getItem("cpscs_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulating login verification (would connect to backend in real implementation)
    try {
      // For demo purposes, we'll check if the user exists in localStorage
      const users = JSON.parse(localStorage.getItem("cpscs_users") || "[]");
      const user = users.find((u: any) => u.email === email);
      
      if (user && user.password === password) {
        // Set user without password in state and localStorage
        const { password: _, ...userWithoutPassword } = user;
        const authUser = {
          ...userWithoutPassword,
          isAuthenticated: true
        };
        
        setUser(authUser);
        localStorage.setItem("cpscs_user", JSON.stringify(authUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // Generate a unique ID
      const userId = `user_${Date.now()}`;
      
      // Create new user object with default profile
      const newUser = {
        id: userId,
        fullName: userData.fullName || "",
        email: userData.email || "",
        sscYear: userData.sscYear || "",
        hscYear: userData.hscYear || "",
        password: userData.password,
        hasMembership: true, // Assume paid if registering
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

      // Store in "users" array (simulating a database)
      const users = JSON.parse(localStorage.getItem("cpscs_users") || "[]");
      users.push(newUser);
      localStorage.setItem("cpscs_users", JSON.stringify(users));
      
      // Store user info in state and localStorage (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      const authUser = {
        ...userWithoutPassword,
        isAuthenticated: true
      };
      
      setUser(authUser);
      localStorage.setItem("cpscs_user", JSON.stringify(authUser));
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Update user profile in localStorage
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          ...profileData
        }
      };
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem("cpscs_users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        const { password } = users[userIndex];
        users[userIndex] = { ...updatedUser, password };
        localStorage.setItem("cpscs_users", JSON.stringify(users));
      }
      
      // Update current user
      setUser(updatedUser);
      localStorage.setItem("cpscs_user", JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    }
  };
  
  const searchAlumni = async (query: string, filters?: Record<string, any>): Promise<User[]> => {
    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("cpscs_users") || "[]");
      
      // Filter users based on search query and filters
      return users
        .filter((user: any) => {
          // Remove password from user objects
          const { password: _, ...userWithoutPassword } = user;
          
          // Basic search (case insensitive)
          const searchString = `${user.fullName} ${user.sscYear} ${user.profile?.profession || ''} ${user.profile?.organization || ''} ${user.profile?.city || ''} ${user.profile?.country || ''} ${user.profile?.expertise?.join(' ') || ''}`.toLowerCase();
          
          let matchesQuery = true;
          if (query) {
            matchesQuery = searchString.includes(query.toLowerCase());
          }
          
          // Apply additional filters if provided
          let matchesFilters = true;
          if (filters) {
            if (filters.batch && filters.batch !== user.sscYear) {
              matchesFilters = false;
            }
            if (filters.profession && (!user.profile?.profession || !user.profile.profession.toLowerCase().includes(filters.profession.toLowerCase()))) {
              matchesFilters = false;
            }
            if (filters.location && (!user.profile?.country || !user.profile.country.toLowerCase().includes(filters.location.toLowerCase()))) {
              matchesFilters = false;
            }
            if (filters.mentorsOnly && (!user.profile?.willingToMentor)) {
              matchesFilters = false;
            }
          }
          
          return matchesQuery && matchesFilters;
        })
        .map((user: any) => {
          // Remove password from user objects
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };
  
  const requestMentorship = async (mentorId: string, message: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // In a real app, this would send an email and store the request in a database
      console.log(`Mentorship request from ${user.fullName} to ${mentorId}: ${message}`);
      
      // Store mentorship request in localStorage for demo purposes
      const mentorshipRequests = JSON.parse(localStorage.getItem("cpscs_mentorship_requests") || "[]");
      mentorshipRequests.push({
        id: `request_${Date.now()}`,
        mentorId,
        requesterId: user.id,
        requesterName: user.fullName,
        requesterEmail: user.email,
        requesterBatch: user.sscYear,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("cpscs_mentorship_requests", JSON.stringify(mentorshipRequests));
      
      return true;
    } catch (error) {
      console.error("Mentorship request error:", error);
      return false;
    }
  };
  
  const toggleContactVisibility = async (contactType: 'email' | 'phone', userId: string): Promise<void> => {
    // In a real app, this would log the access in a database
    console.log(`${contactType} viewed for user ${userId} by ${user?.id}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cpscs_user");
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    // Simulating database check
    const users = JSON.parse(localStorage.getItem("cpscs_users") || "[]");
    return users.some((user: any) => user.email === email);
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
        toggleContactVisibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
