import { CommitteeData, CommitteeTerm, CommitteeByTerm } from '@/types/committee';
import { API_CONFIG, getApiUrl } from '@/config/api';

// Mock API service for committee data
// Replace with actual Laravel API endpoints when backend is ready

class CommitteeService {
  private baseUrl = '/api/committee'; // Replace with actual Laravel API URL



  /**
   * Fetch all available committee terms
   */
  async getTerms(): Promise<CommitteeTerm[]> {
    try {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMITTEES));
      console.log('API /committees response:', response);

      if (!response.ok) throw new Error('Failed to fetch committee terms');
      const data = await response.json();
      console.log('API /committees response:', data);
      return data.map((item: any, idx: number) => ({
        id: String(item.id),
        term: item.term,
        startYear: item.term ? parseInt(item.term.split('-')[0]) : undefined,
        endYear: item.term ? parseInt(item.term.split('-')[1]) : undefined,
        isActive: idx === 0
      }));
    } catch (error) {
      console.error('Error fetching committee terms:', error);
      return [];
    }
  }

  /**
   * Get the latest/current committee term
   */
  async getLatestTerm(): Promise<CommitteeTerm> {
    const terms = await this.getTerms();
    const latestTerm = terms.find(term => term.isActive) || terms[0];
    return latestTerm;
  }

  /**
   * Fetch committee data for a specific term
   */
  async getCommitteeByTerm(termId: string): Promise<CommitteeData> {
    try {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMITTEE_BY_ID(termId)));
      if (!response.ok) throw new Error('Failed to fetch committee data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching committee data for term ${termId}:`, error);
      throw error;
    }
  }

  /**
   * Get the latest committee data
   */
  async getLatestCommittee(): Promise<CommitteeData> {
    const terms = await this.getTerms();
    if (terms.length === 0) throw new Error('No committee terms found');
    return this.getCommitteeByTerm(terms[0].id);
  }
}

export const committeeService = new CommitteeService();