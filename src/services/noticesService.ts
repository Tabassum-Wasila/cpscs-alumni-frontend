import { Notice } from '@/types/notice';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

export class NoticesService {
  static async getNotices(): Promise<Notice[]> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.NOTICES), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notices: ${response.status} ${response.statusText}`);
      }

      const notices: Notice[] = await response.json();
      return notices;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  }

  static async getNoticeById(id: string): Promise<Notice> {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.NOTICES}/${id}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notice: ${response.status} ${response.statusText}`);
      }

      const notice: Notice = await response.json();
      return notice;
    } catch (error) {
      console.error('Error fetching notice:', error);
      throw error;
    }
  }
}
