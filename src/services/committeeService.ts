import { CommitteeData, CommitteeTerm, CommitteeByTerm } from '@/types/committee';
import { committeeData } from '@/data/committeeData';

// Mock API service for committee data
// Replace with actual Laravel API endpoints when backend is ready

class CommitteeService {
  private baseUrl = '/api/committee'; // Replace with actual Laravel API URL

  // Mock data for terms - will be replaced with real API calls
  private mockTerms: CommitteeTerm[] = [
    {
      id: '2024-2026',
      term: '2024-2026',
      startYear: 2024,
      endYear: 2026,
      isActive: true
    },
    {
      id: '2022-2024',
      term: '2022-2024',
      startYear: 2022,
      endYear: 2024,
      isActive: false
    },
    {
      id: '2020-2022',
      term: '2020-2022', 
      startYear: 2020,
      endYear: 2022,
      isActive: false
    }
  ];

  /**
   * Fetch all available committee terms
   */
  async getTerms(): Promise<CommitteeTerm[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/terms`);
      // return response.json();
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => resolve(this.mockTerms), 500);
      });
    } catch (error) {
      console.error('Error fetching committee terms:', error);
      return this.mockTerms;
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
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/${termId}`);
      // return response.json();
      
      // Mock implementation - return current data for all terms for now
      return new Promise((resolve) => {
        setTimeout(() => resolve(committeeData), 300);
      });
    } catch (error) {
      console.error(`Error fetching committee data for term ${termId}:`, error);
      return committeeData;
    }
  }

  /**
   * Get the latest committee data
   */
  async getLatestCommittee(): Promise<CommitteeData> {
    const latestTerm = await this.getLatestTerm();
    return this.getCommitteeByTerm(latestTerm.id);
  }
}

export const committeeService = new CommitteeService();