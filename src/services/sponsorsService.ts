import { SponsorsData } from '@/types/sponsors';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

export class SponsorsService {
  /**
   * Fetch sponsors data from API
   */
  static async getSponsors(): Promise<SponsorsData> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SPONSORS), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sponsors: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      throw error;
    }
  }
}
