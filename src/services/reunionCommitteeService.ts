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
      // call backend reunion endpoint
      const res = await fetch(`/api/committee/${encodeURIComponent(termId)}/reunion`);
      if (!res.ok) {
        console.error('Failed to fetch reunion committee:', res.statusText);
        return null;
      }
      const data = await res.json();
      return data as ReunionCommitteeData;
    } catch (error) {
      console.error('Error fetching reunion committee by term:', error);
    }
  }

  /**
   * Get active reunion committee data
   */
  async getActiveReunionCommittee(): Promise<ReunionCommitteeData | null> {
    try {
      console.debug('[reunionCommitteeService] getActiveReunionCommittee called');

      // Preferred active endpoint
      // const activeRes = await fetch(`/api/committee/active/reunion`);
      // if (activeRes.ok) {
      //   const json = await activeRes.json(); // parse once
      //   console.debug('[reunionCommitteeService] active reunion response:', json);
      //   return json as ReunionCommitteeData;
      // }

      // Fallback to "current" endpoint
      const currentRes = await fetch(`/api/committee/current/reunion`);
      if (currentRes.ok) {
        const json2 = await currentRes.json(); // parse once
        console.debug('[reunionCommitteeService] current reunion response:', json2);
        return json2 as ReunionCommitteeData;
      }

      console.debug('[reunionCommitteeService] no active reunion available', activeRes.status, currentRes.status);
      return null;
    } catch (error) {
      console.error('[reunionCommitteeService] Error fetching active reunion committee:', error);
      return null;
    }
  }
}

export const reunionCommitteeService = new ReunionCommitteeService();