
import { VipBanner, BannerResponse } from '../types/banner';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

class BannerService {
  // Get banner by page path from API
  async getBannerByPath(path: string): Promise<BannerResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BANNER_BY_PATH(path)), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            banner: null,
            success: true,
            message: 'No banner assigned to this page'
          };
        }
        throw new Error(`Failed to fetch banner: ${response.status} ${response.statusText}`);
      }

      const banner: VipBanner = await response.json();
      
      return {
        banner,
        success: true,
        message: 'Banner found'
      };
    } catch (error) {
      console.error('Error fetching banner:', error);
      return {
        banner: null,
        success: false,
        message: 'Failed to fetch banner data'
      };
    }
  }

  // Get all banners from API
  async getAllBanners(): Promise<VipBanner[]> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BANNERS), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch banners: ${response.status} ${response.statusText}`);
      }

      const banners: VipBanner[] = await response.json();
      return banners;
    } catch (error) {
      console.error('Error fetching all banners:', error);
      return [];
    }
  }
}

export const bannerService = new BannerService();
