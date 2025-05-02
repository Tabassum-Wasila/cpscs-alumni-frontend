
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  sscYear: string;
  isAuthenticated: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  checkEmailExists: (email: string) => Promise<boolean>;
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
      
      // Create new user object
      const newUser = {
        id: userId,
        fullName: userData.fullName || "",
        email: userData.email || "",
        sscYear: userData.sscYear || "",
        password: userData.password,
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
        checkEmailExists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
