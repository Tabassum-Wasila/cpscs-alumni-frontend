
import { VipBanner, BannerResponse } from '../types/banner';

// Mock data for testing - in production this would be actual API calls
const mockBannerData: VipBanner[] = [
  {
    id: '1',
    pagePathIdentifier: '/',
    sponsorBannerUrl: 'https://i.postimg.cc/KYMKgR1S/Test-VIP-sponsor-1200-x-300-px.png',
    sponsorRedirectUrl: 'https://example.com/vip-sponsor-1',
    bannerSize: 'large'
  },
  {
    id: '2',
    pagePathIdentifier: '/notice-board',
    sponsorBannerUrl: 'https://i.postimg.cc/pTQpq4Qs/Test-VIP-sponsor-1200x150.gif',
    sponsorRedirectUrl: 'https://example.com/vip-sponsor-2',
    bannerSize: 'standard'
  },
  {
    id: '3',
    pagePathIdentifier: '/gallery',
    sponsorBannerUrl: 'https://i.postimg.cc/pTQpq4Qs/Test-VIP-sponsor-1200x150.gif',
    sponsorRedirectUrl: 'https://example.com/vip-sponsor-3',
    bannerSize: 'standard'
  }
];

class BannerService {
  // Simulate API call to get banner by page path
  async getBannerByPath(path: string): Promise<BannerResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const banner = mockBannerData.find(b => b.pagePathIdentifier === path) || null;
      
      return {
        banner,
        success: true,
        message: banner ? 'Banner found' : 'No banner assigned to this page'
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

  // Get all banners (for admin panel - future use)
  async getAllBanners(): Promise<VipBanner[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockBannerData;
    } catch (error) {
      console.error('Error fetching all banners:', error);
      return [];
    }
  }
}

export const bannerService = new BannerService();
