import { committeeData } from '@/data/committeeData';

export interface FeaturedAlumni {
  id: string;
  fullName: string;
  profilePicture: string;
  sscYear: string;
  hscYear: string;
  profession: string;
  organization: string;
  profileCompletionScore: number;
  slug: string;
}

export class HomeAlumniService {
  
  /**
   * Backend API Specification for Future Integration
   * 
   * GET /api/alumni/featured?limit=40&min_completion=80
   * Response: { 
   *   alumni: FeaturedAlumni[], 
   *   total: number, 
   *   hasMore: boolean 
   * }
   * 
   * Profile Completion Criteria (Qualified Alumni):
   * - Must have profilePicture (photo field)
   * - Must have sscYear and hscYear 
   * - Must have profession
   * - Must have organization
   * - Profile completion score ≥ 80%
   * - Account must be active and verified
   */

  // Transform committee data to alumni data for dummy implementation
  private static transformCommitteeToAlumni(committee: any): FeaturedAlumni {
    const slug = this.generateSlug(committee.name, committee.ssc_batch);
    
    return {
      id: committee.sequence.toString(),
      fullName: committee.name,
      profilePicture: committee.photo,
      sscYear: committee.ssc_batch,
      hscYear: committee.hsc_batch,
      profession: committee.profession,
      organization: committee.organization || 'Not specified',
      profileCompletionScore: this.calculateCompletionScore(committee),
      slug
    };
  }

  // Calculate profile completion score based on available data
  private static calculateCompletionScore(committee: any): number {
    let score = 0;
    const maxScore = 5;
    
    // Required fields for qualified alumni
    if (committee.photo) score += 1;                    // Profile picture required
    if (committee.name) score += 1;                     // Full name required
    if (committee.profession) score += 1;               // Profession required
    if (committee.organization) score += 1;             // Organization required
    if (committee.ssc_batch && committee.hsc_batch) score += 1;  // Education years required
    
    return Math.round((score / maxScore) * 100);
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

  // Filter alumni based on profile completion criteria (Qualified Alumni Requirements)
  private static filterQualifiedAlumni(alumni: FeaturedAlumni[]): FeaturedAlumni[] {
    return alumni.filter(alumnus => 
      alumnus.profileCompletionScore >= 80 &&
      alumnus.profilePicture &&                    // Must have profile picture
      alumnus.fullName &&                          // Must have full name
      alumnus.profession &&                        // Must have profession
      alumnus.organization &&                      // Must have organization
      alumnus.sscYear &&                           // Must have SSC year
      alumnus.hscYear                              // Must have HSC year
    );
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

      console.log('Total committee members:', allCommitteeMembers.length);
      
      const transformedAlumni = allCommitteeMembers.map((member) => this.transformCommitteeToAlumni(member));
      console.log('Transformed alumni:', transformedAlumni.length);
      
      // Filter qualified alumni (80%+ completion)
      const qualifiedAlumni = this.filterQualifiedAlumni(transformedAlumni);
      console.log('Qualified alumni:', qualifiedAlumni.length);
      
      // Shuffle and limit the results
      const shuffledAlumni = this.shuffleArray(qualifiedAlumni);
      console.log('Final alumni for display:', shuffledAlumni.length);
      
      return shuffledAlumni.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured alumni:', error);
      return [];
    }
  }

  // Get alumni data for flowing rows animation (ensures 20+ cards each for smooth circular flow)
  static async getAlumniForFlowingRows(): Promise<{ topRow: FeaturedAlumni[], bottomRow: FeaturedAlumni[] }> {
    try {
      const featuredAlumni = await this.getFeaturedAlumni(50); // Get more alumni for better distribution
      
      if (featuredAlumni.length === 0) {
        return { topRow: [], bottomRow: [] };
      }
      
      // Ensure we have enough data by intelligently duplicating the alumni
      let expandedAlumni = [...featuredAlumni];
      
      // If we have less than 40 alumni, duplicate the array to ensure smooth flow
      while (expandedAlumni.length < 40) {
        const shuffledCopy = this.shuffleArray([...featuredAlumni]);
        expandedAlumni = [...expandedAlumni, ...shuffledCopy];
      }
      
      // Split into two rows with 20+ items each
      const midpoint = Math.ceil(expandedAlumni.length / 2);
      const topRow = expandedAlumni.slice(0, midpoint);
      const bottomRow = expandedAlumni.slice(midpoint);
      
      console.log(`Alumni rows created - Top: ${topRow.length}, Bottom: ${bottomRow.length}`);
      
      return { 
        topRow: this.shuffleArray(topRow), 
        bottomRow: this.shuffleArray(bottomRow) 
      };
    } catch (error) {
      console.error('Error getting alumni for flowing rows:', error);
      return { topRow: [], bottomRow: [] };
    }
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
        'organization'
      ],
      minimumCompletionScore: 80
    };
  }
}

export const homeAlumniService = new HomeAlumniService();