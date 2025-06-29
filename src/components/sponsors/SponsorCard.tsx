
import React from 'react';
import { Sponsor } from '@/types/sponsors';
import { Building2, User, ExternalLink } from 'lucide-react';

interface SponsorCardProps {
  sponsor: Sponsor;
  onClick: (sponsor: Sponsor) => void;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, onClick }) => {
  const isOrganization = sponsor.type === 'organization';
  const displayImage = isOrganization ? sponsor.logo : sponsor.profilePhoto;

  return (
    <div 
      className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      onClick={() => onClick(sponsor)}
    >
      {/* Premium gradient background with liquid flow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cpscs-gold/10 via-yellow-100/20 to-cpscs-gold/5 rounded-2xl blur-sm group-hover:blur-none transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-white/60 to-white/40 rounded-2xl backdrop-blur-sm border border-white/30 group-hover:border-cpscs-gold/30 transition-all duration-500" />
      
      {/* Animated liquid background */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-cpscs-gold/20 to-yellow-200/30 rounded-full blur-xl animate-float opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tl from-yellow-100/30 to-cpscs-gold/20 rounded-full blur-xl animate-float opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '1s' }} />
      </div>

      {/* Card content */}
      <div className="relative p-6 rounded-2xl h-full">
        {/* Header with logo/photo */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <img 
                src={displayImage} 
                alt={sponsor.name}
                className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
              />
            </div>
            {/* Floating animation indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cpscs-gold to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-cpscs-blue group-hover:text-cpscs-gold transition-colors duration-300 truncate">
              {sponsor.name}
            </h3>
            {isOrganization && sponsor.industry && (
              <p className="text-sm text-gray-600 font-medium truncate">{sponsor.industry}</p>
            )}
            {!isOrganization && sponsor.designation && (
              <p className="text-sm text-gray-600 font-medium truncate">{sponsor.designation}</p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {isOrganization ? (
              <Building2 className="w-5 h-5 text-cpscs-blue/60 group-hover:text-cpscs-gold transition-colors duration-300" />
            ) : (
              <User className="w-5 h-5 text-cpscs-blue/60 group-hover:text-cpscs-gold transition-colors duration-300" />
            )}
          </div>
        </div>

        {/* Short description */}
        {sponsor.shortDescription && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
            {sponsor.shortDescription}
          </p>
        )}

        {/* Tags for organizations */}
        {isOrganization && sponsor.tags && sponsor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {sponsor.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-cpscs-gold/20 text-cpscs-blue text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Company info for patrons */}
        {!isOrganization && sponsor.company && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Company:</span> {sponsor.company}
            </p>
          </div>
        )}

        {/* Contribution indicator */}
        {sponsor.contributedAmount && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Contribution</span>
            <span className="text-sm font-bold text-cpscs-gold">
              ৳{sponsor.contributedAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Hover indicator */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-cpscs-blue font-medium">Click to view details</span>
          <ExternalLink className="w-4 h-4 text-cpscs-blue/60" />
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;
