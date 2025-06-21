
import { User } from '@/contexts/AuthContext';

export class AdminService {
  private static readonly STORAGE_KEY = 'cpscs_users';

  static async addDemoUsers(): Promise<boolean> {
    try {
      const demoUsers = [
        {
          id: 'demo_1',
          fullName: 'Dr. Rashida Ahmed',
          email: 'rashida.ahmed@example.com',
          sscYear: '1995',
          hscYear: '1997',
          hasMembership: true,
          isDemoUser: true,
          profile: {
            profilePicture: '/placeholder.svg',
            bio: 'Senior Software Engineer at Google with 15+ years of experience in distributed systems.',
            profession: 'Software Engineer',
            organization: 'Google',
            city: 'Mountain View',
            country: 'USA',
            expertise: ['Software Engineering', 'System Design', 'Machine Learning'],
            willingToMentor: true,
            mentorshipAreas: ['Career Development', 'Technical Skills'],
            showPhone: false
          }
        },
        {
          id: 'demo_2',
          fullName: 'Prof. Mohammed Hassan',
          email: 'mohammed.hassan@example.com',
          sscYear: '1988',
          hscYear: '1990',
          hasMembership: true,
          isDemoUser: true,
          profile: {
            profilePicture: '/placeholder.svg',
            bio: 'Professor of Computer Science at MIT, specializing in AI and machine learning research.',
            profession: 'Professor',
            organization: 'MIT',
            city: 'Cambridge',
            country: 'USA',
            expertise: ['Artificial Intelligence', 'Research', 'Academia'],
            willingToMentor: true,
            mentorshipAreas: ['Academic Career', 'Research'],
            showPhone: false
          }
        },
        {
          id: 'demo_3',
          fullName: 'Dr. Fatima Khan',
          email: 'fatima.khan@example.com',
          sscYear: '1992',
          hscYear: '1994',
          hasMembership: true,
          isDemoUser: true,
          profile: {
            profilePicture: '/placeholder.svg',
            bio: 'Cardiologist at Mayo Clinic, dedicated to advancing cardiovascular medicine.',
            profession: 'Doctor',
            organization: 'Mayo Clinic',
            city: 'Rochester',
            country: 'USA',
            expertise: ['Medicine', 'Cardiology', 'Healthcare'],
            willingToMentor: true,
            mentorshipAreas: ['Medical Career', 'Healthcare Leadership'],
            showPhone: false
          }
        }
      ];

      const existingUsers = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      const demoUserIds = demoUsers.map(user => user.id);
      const filteredUsers = existingUsers.filter((user: any) => !demoUserIds.includes(user.id));
      
      const updatedUsers = [...filteredUsers, ...demoUsers];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error('Error adding demo users:', error);
      return false;
    }
  }

  static async removeDemoUsers(): Promise<boolean> {
    try {
      const existingUsers = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      const filteredUsers = existingUsers.filter((user: any) => !user.isDemoUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error removing demo users:', error);
      return false;
    }
  }

  static async getDemoUsersCount(): Promise<number> {
    try {
      const existingUsers = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return existingUsers.filter((user: any) => user.isDemoUser).length;
    } catch (error) {
      console.error('Error getting demo users count:', error);
      return 0;
    }
  }
}
