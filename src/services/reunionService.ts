import { delay } from '@/lib/utils';

export interface ReunionData {
  is_reunion: boolean;
  is_active: boolean;
  event_date: string;
  event_id: string;
  registration_url?: string;
  title?: string;
}

class ReunionService {
  private baseUrl = '/api';

  async getActiveReunion(): Promise<ReunionData | null> {
    try {
      // TODO: Replace with actual Laravel API endpoint
      // const response = await fetch(`${this.baseUrl}/reunion/active`);
      // if (!response.ok) throw new Error('Failed to fetch reunion data');
      // return await response.json();

      // Mock data for development - replace with actual API call
      await delay(500); // Simulate API delay
      
      // Mock active reunion data
      return {
        is_reunion: true,
        is_active: true,
        event_date: 'December 25, 2025 09:00:00',
        event_id: 'reunion-2025',
        title: 'Grand Alumni Reunion 2025'
      };
    } catch (error) {
      console.error('Error fetching reunion data:', error);
      return null;
    }
  }
}

export const reunionService = new ReunionService();