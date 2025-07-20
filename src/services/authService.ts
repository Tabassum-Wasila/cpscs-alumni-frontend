import { SignupFormData } from '@/components/auth/SignupForm';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  sscYear: string;
  hscYear: string;
  dateJoined: string;
  hasMembership: boolean;
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

  static createUser(userData: SignupFormData): User {
    const newUser: User = {
      id: crypto.randomUUID(),
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      sscYear: userData.sscYear,
      hscYear: userData.hscYear,
      dateJoined: new Date().toISOString(),
      hasMembership: false,
      profile: {
        profilePicture: '',
        bio: '',
        profession: '',
        organization: '',
        city: '',
        country: '',
        phoneNumber: '',
        showPhone: true, // Changed from false to true - default to showing phone
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
}
