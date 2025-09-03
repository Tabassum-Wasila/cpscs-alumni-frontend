import { delay } from '@/lib/utils';
import { ReunionCommitteeData } from '@/types/reunionCommittee';
import { committeeData } from '@/data/committeeData';

class ReunionCommitteeService {
  private baseUrl = '/api/reunion-committee';

  /**
   * Get active reunion committee data
   */
  async getActiveReunionCommittee(): Promise<ReunionCommitteeData | null> {
    try {
      // TODO: Replace with actual Laravel API endpoint
      // const response = await fetch(`${this.baseUrl}/active`);
      // if (!response.ok) return null;
      // return await response.json();

      // Mock implementation - distribute existing committee members across reunion committees
      await delay(500);
      
      const allMembers = [
        ...committeeData.executiveCommittee,
        ...committeeData.advisorCouncil,
        ...committeeData.ambassadors
      ];

      // Shuffle and distribute members across committees
      const shuffled = [...allMembers].sort(() => Math.random() - 0.5);
      
      return {
        title: "Grand Alumni Reunion 2025 Committee",
        subtitle: "Organizing Committee",
        event_date: "December 25, 2025",
        event_id: "reunion-2025",
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
    } catch (error) {
      console.error('Error fetching reunion committee data:', error);
      return null;
    }
  }
}

export const reunionCommitteeService = new ReunionCommitteeService();