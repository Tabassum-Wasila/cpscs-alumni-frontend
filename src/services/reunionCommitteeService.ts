import { delay } from '@/lib/utils';
import { ReunionCommitteeData, ReunionCommitteeTerm } from '@/types/reunionCommittee';
import { committeeData } from '@/data/committeeData';

class ReunionCommitteeService {
  private baseUrl = '/api/reunion-committee';

  /**
   * Get available reunion committee terms
   */
  async getReunionTerms(): Promise<ReunionCommitteeTerm[]> {
    try {
      // TODO: Replace with actual Laravel API endpoint
      // const response = await fetch(`${this.baseUrl}/terms`);
      // if (!response.ok) return [];
      // return await response.json();

      // Mock implementation
      await delay(300);
      
      return [
        {
          id: 'reunion-2025',
          term: 'Grand Reunion 2025',
          isActive: true
        },
        {
          id: 'reunion-2024',
          term: 'Grand Reunion 2024',
          isActive: false
        },
        {
          id: 'reunion-2023',
          term: 'Grand Reunion 2023',
          isActive: false
        }
      ];
    } catch (error) {
      console.error('Error fetching reunion terms:', error);
      return [];
    }
  }

  /**
   * Get reunion committee data by term
   */
  async getReunionCommitteeByTerm(termId: string): Promise<ReunionCommitteeData | null> {
    try {
      // TODO: Replace with actual Laravel API endpoint
      // const response = await fetch(`${this.baseUrl}/term/${termId}`);
      // if (!response.ok) return null;
      // return await response.json();

      // Mock implementation
      await delay(500);
      
      return this.generateMockCommitteeData(termId);
    } catch (error) {
      console.error('Error fetching reunion committee by term:', error);
      return null;
    }
  }

  /**
   * Get active reunion committee data
   */
  async getActiveReunionCommittee(): Promise<ReunionCommitteeData | null> {
    try {
      // TODO: Replace with actual Laravel API endpoint
      // const response = await fetch(`${this.baseUrl}/active`);
      // if (!response.ok) return null;
      // return await response.json();

      // Mock implementation
      await delay(500);
      
      return this.generateMockCommitteeData('reunion-current');
    } catch (error) {
      console.error('Error fetching reunion committee data:', error);
      return null;
    }
  }

  /**
   * Generate mock committee data for any term
   */
  private generateMockCommitteeData(termId: string): ReunionCommitteeData {
    const allMembers = [
      ...committeeData.executiveCommittee,
      ...committeeData.advisorCouncil,
      ...committeeData.ambassadors
    ];

    // Shuffle and distribute members across committees
    const shuffled = [...allMembers].sort(() => Math.random() - 0.5);
    
    return {
      title: "Grand Alumni Reunion Committee",
      subtitle: "Organizing Committee",
      event_id: termId,
      committees: {
        conveningCommittee: shuffled.slice(0, 8),
        registrationCommittee: shuffled.slice(8, 15),
        publicityCommittee: shuffled.slice(15, 22),
        foodCommittee: shuffled.slice(22, 28),
        sponsorCommittee: shuffled.slice(28, 35),
        sportsCommittee: shuffled.slice(35, 41),
        culturalCommittee: shuffled.slice(41, 48),
        receptionCommittee: shuffled.slice(48, 55),
        batchCoordinators: shuffled.slice(55, 65)
      }
    };
  }
}

export const reunionCommitteeService = new ReunionCommitteeService();