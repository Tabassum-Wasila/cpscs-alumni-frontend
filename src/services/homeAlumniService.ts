import { committeeData } from '@/data/committeeData';
import { UserService } from './userService';

export interface FeaturedAlumni {
  id: string;
  fullName: string;
  profilePicture: string;
  sscYear: string;
  hscYear: string;
  profession: string;
  organization: string;
  bio: string;
  profileCompletionScore: number;
  slug: string;
}

export class HomeAlumniService {
  // Transform committee data to alumni data for dummy implementation
  private static transformCommitteeToAlumni(committee: any): FeaturedAlumni {
    const bio = committee.position && committee.organization 
      ? `${committee.position} with extensive experience in ${committee.profession}`
      : `Experienced professional in ${committee.profession}`;

    const slug = this.generateSlug(committee.name, committee.ssc_batch);
    
    return {
      id: committee.sequence.toString(),
      fullName: committee.name,
      profilePicture: committee.photo,
      sscYear: committee.ssc_batch,
      hscYear: committee.hsc_batch,
      profession: committee.profession,
      organization: committee.organization || 'Self Employed',
      bio: bio,
      profileCompletionScore: Math.floor(Math.random() * 16) + 80, // 80-95%
      slug: slug
    };
  }

  private static generateSlug(name: string, sscYear: string): string {
    const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    return `${nameSlug}-${sscYear}`;
  }

  // Shuffle array using Fisher-Yates algorithm
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Filter alumni with 80%+ profile completion (dummy implementation)
  private static filterQualifiedAlumni(alumni: FeaturedAlumni[]): FeaturedAlumni[] {
    return alumni.filter(alumni => alumni.profileCompletionScore >= 80);
  }

  // Get featured alumni for homepage display
  static async getFeaturedAlumni(limit: number = 20): Promise<FeaturedAlumni[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Transform all committee members to alumni format
      const allCommitteeMembers = [
        ...committeeData.executiveCommittee,
        ...committeeData.advisorCouncil,
        ...committeeData.ambassadors
      ];

      const transformedAlumni = allCommitteeMembers.map(this.transformCommitteeToAlumni);
      
      // Filter qualified alumni (80%+ completion)
      const qualifiedAlumni = this.filterQualifiedAlumni(transformedAlumni);
      
      // Shuffle and limit the results
      const shuffledAlumni = this.shuffleArray(qualifiedAlumni);
      
      return shuffledAlumni.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured alumni:', error);
      return [];
    }
  }

  // Get alumni divided into two rows for flowing animation
  static async getAlumniForFlowingRows(): Promise<{ topRow: FeaturedAlumni[], bottomRow: FeaturedAlumni[] }> {
    const featuredAlumni = await this.getFeaturedAlumni(20);
    
    // Split alumni into two rows
    const midpoint = Math.ceil(featuredAlumni.length / 2);
    const topRow = featuredAlumni.slice(0, midpoint);
    const bottomRow = featuredAlumni.slice(midpoint);
    
    return { topRow, bottomRow };
  }

  // For future Laravel backend integration
  static getProfileCompletionCriteria() {
    return {
      requiredFields: [
        'profilePicture',
        'fullName', 
        'sscYear',
        'hscYear',
        'profession',
        'organization',
        'bio'
      ],
      minimumCompletionScore: 80
    };
  }
}

export const homeAlumniService = new HomeAlumniService();