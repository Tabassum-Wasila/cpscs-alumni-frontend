import { delay } from '@/lib/utils';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

export interface ReunionData {
  isReunion: boolean;
  isActive: boolean;
  eventDate: string;
  eventId: string;
  registrationUrl?: string | null;
  title?: string;
}

class ReunionService {
  async getActiveReunion(): Promise<ReunionData | null> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ACTIVE_REUNION), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch active reunion: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching active reunion:', error);
      
      // Fallback to mock data for development
      await delay(500); // Simulate API delay
      
      // Mock active reunion data matching the new API response structure
      return {
        isReunion: true,
        isActive: true,
        eventDate: '2025-12-26',
        eventId: '10',
        registrationUrl: null,
        title: 'Grand Alumni Reunion 2025'
      };
    }
  }
}

export const reunionService = new ReunionService();