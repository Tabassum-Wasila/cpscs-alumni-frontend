
import { User } from '@/contexts/AuthContext';

export interface SearchFilters {
  batch?: string;
  profession?: string;
  location?: string;
  mentorsOnly?: boolean;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterBatch: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export class AlumniService {
  private static USERS_KEY = 'cpscs_users';
  private static MENTORSHIP_REQUESTS_KEY = 'cpscs_mentorship_requests';

  static async searchAlumni(query: string, filters?: SearchFilters): Promise<User[]> {
    try {
      const users = this.getStoredUsers();
      
      return users
        .filter((user: any) => {
          const searchString = `${user.fullName} ${user.sscYear} ${user.profile?.profession || ''} ${user.profile?.organization || ''} ${user.profile?.city || ''} ${user.profile?.country || ''} ${user.profile?.expertise?.join(' ') || ''}`.toLowerCase();
          
          let matchesQuery = true;
          if (query) {
            matchesQuery = searchString.includes(query.toLowerCase());
          }
          
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
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  static async requestMentorship(mentorId: string, requesterId: string, requesterData: { name: string; email: string; batch: string }, message: string): Promise<boolean> {
    try {
      const mentorshipRequests = this.getStoredMentorshipRequests();
      const newRequest: MentorshipRequest = {
        id: `request_${Date.now()}`,
        mentorId,
        requesterId,
        requesterName: requesterData.name,
        requesterEmail: requesterData.email,
        requesterBatch: requesterData.batch,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      mentorshipRequests.push(newRequest);
      localStorage.setItem(this.MENTORSHIP_REQUESTS_KEY, JSON.stringify(mentorshipRequests));
      
      return true;
    } catch (error) {
      console.error("Mentorship request error:", error);
      return false;
    }
  }

  static logContactView(contactType: 'email' | 'phone', userId: string, viewerId: string): void {
    console.log(`${contactType} viewed for user ${userId} by ${viewerId}`);
    // In a real app, this would log the access in a database
  }

  private static getStoredUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]");
    } catch (error) {
      console.error("Error getting stored users:", error);
      return [];
    }
  }

  private static getStoredMentorshipRequests(): MentorshipRequest[] {
    try {
      return JSON.parse(localStorage.getItem(this.MENTORSHIP_REQUESTS_KEY) || "[]");
    } catch (error) {
      console.error("Error getting stored mentorship requests:", error);
      return [];
    }
  }
}
