
import React from 'react';
import { VipBanner } from '../types/banner';
import { cn } from '../lib/utils';

interface VipSponsorBannerProps {
  bannerData: VipBanner | null;
  isLoading?: boolean;
}

const VipSponsorBanner: React.FC<VipSponsorBannerProps> = ({ 
  bannerData, 
  isLoading = false 
}) => {
  // Don't render anything if no banner data or still loading
  if (isLoading || !bannerData) {
    return null;
  }

  const { sponsorBannerUrl, sponsorRedirectUrl, bannerSize } = bannerData;

  return (
    <div className="w-full">
      <a
        href={sponsorRedirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "vip-banner-container",
          `size-${bannerSize}`,
          "block max-w-[1200px] mx-auto my-8 no-underline transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg overflow-hidden"
        )}
        aria-label="VIP Sponsor Banner"
      >
        <img
          src={sponsorBannerUrl}
          alt="VIP Sponsor Banner"
          className="w-full h-full object-cover block"
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default VipSponsorBanner;
