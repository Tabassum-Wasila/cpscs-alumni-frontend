
import React from 'react';
import { Sponsor } from '@/types/sponsors';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Calendar, DollarSign, Quote, X } from 'lucide-react';

interface SponsorModalProps {
  sponsor: Sponsor | null;
  isOpen: boolean;
  onClose: () => void;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ sponsor, isOpen, onClose }) => {
  if (!sponsor) return null;

  const isOrganization = sponsor.type === 'organization';
  const displayImage = isOrganization ? sponsor.logo : sponsor.profilePhoto;
  const displayName = !isOrganization && sponsor.fullName ? sponsor.fullName : sponsor.name;

  const handleKnowMore = () => {
    const url = sponsor.website || sponsor.socialLinks?.linkedin || sponsor.socialLinks?.facebook;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none">
        <div className="relative">
          {/* Premium glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30" />
          <div className="absolute inset-0 bg-gradient-to-br from-cpscs-gold/5 via-transparent to-yellow-100/10 rounded-3xl" />
          
          {/* Animated background elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cpscs-gold/20 to-yellow-200/30 rounded-full blur-2xl animate-float opacity-60" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tl from-yellow-100/30 to-cpscs-gold/20 rounded-full blur-xl animate-float opacity-60" style={{ animationDelay: '2s' }} />

          <div className="relative z-10">
            {/* Banner Section */}
            {sponsor.bannerImage && (
              <div className="relative h-48 md:h-64 rounded-t-3xl overflow-hidden">
                <img 
                  src={sponsor.bannerImage} 
                  alt={`${sponsor.name} banner`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Logo/Profile photo overlay */}
                <div className="absolute bottom-4 left-6 md:left-8">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                    <img 
                      src={displayImage} 
                      alt={sponsor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <DialogHeader className="mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-cpscs-blue mb-2">
                      {displayName}
                    </h2>
                    
                    {isOrganization && sponsor.industry && (
                      <p className="text-lg text-gray-600 mb-2">{sponsor.industry}</p>
                    )}
                    
                    {!isOrganization && sponsor.designation && (
                      <p className="text-lg text-gray-600 mb-1">{sponsor.designation}</p>
                    )}
                    
                    {!isOrganization && sponsor.company && (
                      <p className="text-md text-gray-500 mb-2">{sponsor.company}</p>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Description */}
              {sponsor.shortDescription && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {sponsor.shortDescription}
                  </p>
                </div>
              )}

              {/* Tags for organizations */}
              {isOrganization && sponsor.tags && sponsor.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">CATEGORIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {sponsor.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-cpscs-gold/20 to-yellow-100/30 text-cpscs-blue text-sm rounded-full font-medium border border-cpscs-gold/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contribution Amount */}
              {sponsor.contributedAmount && (
                <div className="mb-6 p-4 bg-gradient-to-r from-cpscs-gold/10 to-yellow-100/20 rounded-2xl border border-cpscs-gold/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cpscs-gold/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-cpscs-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Contribution</p>
                      <p className="text-2xl font-bold text-cpscs-blue">
                        ৳{sponsor.contributedAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quote Section */}
              {sponsor.quote && (
                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/50 relative">
                  <Quote className="absolute top-4 left-4 w-6 h-6 text-cpscs-blue/30" />
                  <blockquote className="text-lg italic text-gray-700 leading-relaxed pl-8">
                    "{sponsor.quote}"
                  </blockquote>
                  <cite className="text-sm text-gray-500 mt-2 block pl-8">
                    — {sponsor.name}
                  </cite>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {(sponsor.website || sponsor.socialLinks?.linkedin || sponsor.socialLinks?.facebook) && (
                  <Button 
                    onClick={handleKnowMore}
                    className="bg-gradient-to-r from-cpscs-blue to-cpscs-blue/90 hover:from-cpscs-blue/90 hover:to-cpscs-blue/80 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Know More
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="border-2 border-cpscs-gold/30 text-cpscs-blue hover:bg-cpscs-gold/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Close
                </Button>
              </div>

              {/* Date added */}
              <div className="mt-6 pt-4 border-t border-gray-200/50">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Added on {new Date(sponsor.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorModal;
