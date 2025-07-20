
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SponsorCard from '../components/sponsors/SponsorCard';
import SponsorModal from '../components/sponsors/SponsorModal';
import SponsorSearch from '../components/sponsors/SponsorSearch';
import { sponsorsData } from '@/data/sponsorsData';
import { Sponsor, SponsorFilters } from '@/types/sponsors';
import { Heart, Building2, Users, Star, Trophy } from 'lucide-react';

const Sponsors = () => {
  const location = useLocation();
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'organizations' | 'patrons'>('organizations');
  const [filters, setFilters] = useState<SponsorFilters>({
    sortBy: 'newest'
  });

  // Fetch banner data based on current path
  const { data: bannerResponse, isLoading: bannerLoading } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  const handleSponsorClick = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSponsor(null);
  };

  const handleFiltersChange = (newFilters: SponsorFilters) => {
    setFilters(newFilters);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'organizations' | 'patrons');
    setFilters({ sortBy: 'newest' }); // Reset filters when switching tabs
  };

  // Filter and sort sponsors
  const filteredSponsors = useMemo(() => {
    const currentSponsors = activeTab === 'organizations' 
      ? sponsorsData.organizations 
      : sponsorsData.patrons;

    let filtered = [...currentSponsors];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(sponsor => 
        sponsor.name.toLowerCase().includes(query) ||
        sponsor.shortDescription?.toLowerCase().includes(query) ||
        (sponsor.type === 'organization' && sponsor.industry?.toLowerCase().includes(query)) ||
        (sponsor.type === 'patron' && sponsor.designation?.toLowerCase().includes(query)) ||
        (sponsor.type === 'patron' && sponsor.company?.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(sponsor => {
        if (sponsor.type === 'organization') {
          return sponsor.tags?.includes(filters.category!) || 
                 sponsor.industry?.includes(filters.category!);
        }
        return sponsor.designation?.includes(filters.category!) ||
               sponsor.company?.includes(filters.category!);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      
      if (filters.sortBy === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  }, [activeTab, filters]);

  const renderSponsorGrid = (sponsors: Sponsor[]) => {
    if (sponsors.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cpscs-gold/20 to-yellow-100/30 flex items-center justify-center mb-6">
            {activeTab === 'organizations' ? (
              <Building2 className="w-12 h-12 text-cpscs-gold" />
            ) : (
              <Users className="w-12 h-12 text-cpscs-gold" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No {activeTab} found!</h3>
          <p className="text-gray-600 max-w-md">
            {filters.searchQuery 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : `${activeTab === 'organizations' ? 'Organizations' : 'Individual patrons'} will be displayed here once they are added.`
            }
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {sponsors.map(sponsor => (
          <SponsorCard 
            key={sponsor.id} 
            sponsor={sponsor} 
            onClick={handleSponsorClick} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cpscs-gold/20 to-yellow-100/30 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-10 h-10 text-cpscs-blue" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cpscs-gold to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-cpscs-blue mb-4">Our Valued Sponsors</h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              We are deeply grateful to our sponsors who believe in our mission and contribute to the 
              growth of our alumni community. Their support enables us to create meaningful connections, 
              provide valuable resources, and make a lasting impact.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cpscs-gold/20 to-yellow-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-cpscs-blue" />
              </div>
              <h3 className="text-2xl font-bold text-cpscs-blue">{sponsorsData.organizations.length}</h3>
              <p className="text-gray-600">Partner Organizations</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cpscs-gold/20 to-yellow-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-cpscs-blue" />
              </div>
              <h3 className="text-2xl font-bold text-cpscs-blue">{sponsorsData.patrons.length}</h3>
              <p className="text-gray-600">Individual Patrons</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cpscs-gold/20 to-yellow-100/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-cpscs-blue" />
              </div>
              <h3 className="text-2xl font-bold text-cpscs-blue">
                ৳{(sponsorsData.organizations.reduce((sum, org) => sum + (org.contributedAmount || 0), 0) + 
                   sponsorsData.patrons.reduce((sum, patron) => sum + (patron.contributedAmount || 0), 0)).toLocaleString()}
              </h3>
              <p className="text-gray-600">Total Contributions</p>
            </div>
          </div>
          
          {/* Sponsor Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/70 backdrop-blur-sm shadow-xl border border-white/40">
                <TabsTrigger value="organizations" className="text-sm font-semibold px-6">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Organizations</span>
                  <span className="sm:hidden">Orgs</span>
                </TabsTrigger>
                <TabsTrigger value="patrons" className="text-sm font-semibold px-6">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Individual Patrons</span>
                  <span className="sm:hidden">Patrons</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filter */}
            <SponsorSearch
              onFiltersChange={handleFiltersChange}
              totalCount={filteredSponsors.length}
              activeTab={activeTab}
            />

            <TabsContent value="organizations" className="mt-6">
              {renderSponsorGrid(filteredSponsors)}
            </TabsContent>

            <TabsContent value="patrons" className="mt-6">
              {renderSponsorGrid(filteredSponsors)}
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-cpscs-blue/5 via-cpscs-gold/5 to-cpscs-blue/5 rounded-3xl p-12 border border-cpscs-gold/20">
            <h2 className="text-3xl font-bold text-cpscs-blue mb-4">
              Become a Sponsor
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Join our community of sponsors and help us build a stronger alumni network. 
              Your support makes a real difference in connecting our alumni and creating opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-cpscs-blue to-cpscs-blue/90 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Partner with Us
              </button>
              <button className="border-2 border-cpscs-gold text-cpscs-blue hover:bg-cpscs-gold/10 px-8 py-4 rounded-full font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Sponsor Detail Modal */}
          <SponsorModal 
            sponsor={selectedSponsor} 
            isOpen={isModalOpen} 
            onClose={handleModalClose} 
          />
        </div>
      </div>
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner 
        bannerData={bannerResponse?.banner || null} 
        isLoading={bannerLoading}
      />
      
      <Footer />
    </div>
  );
};

export default Sponsors;
