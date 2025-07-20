
export type BannerSize = 'standard' | 'large';

export interface VipBanner {
  id: string;
  pagePathIdentifier: string;
  sponsorBannerUrl: string;
  sponsorRedirectUrl: string;
  bannerSize: BannerSize;
}

export interface BannerResponse {
  banner: VipBanner | null;
  success: boolean;
  message?: string;
}
