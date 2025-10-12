
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VipSponsorBanner from '../components/VipSponsorBanner';
import { bannerService } from '../services/bannerService';
import { NoticesService } from '../services/noticesService';
import { Bell, Loader2 } from 'lucide-react';
import NoticeCard from '../components/notice/NoticeCard';
import NoticeModal from '../components/notice/NoticeModal';
import NoticeHeader from '../components/notice/NoticeHeader';
import { Notice, NoticeFilters } from '../types/notice';

const NoticeBoard = () => {
  const location = useLocation();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<NoticeFilters>({
    searchQuery: '',
    sortBy: 'date-desc',
  });

  // Fetch banner data based on current path
  const { data: bannerResponse, isLoading: bannerLoading } = useQuery({
    queryKey: ['vip-banner', location.pathname],
    queryFn: () => bannerService.getBannerByPath(location.pathname)
  });

  // Fetch notices data from API
  const { data: noticesData, isLoading: noticesLoading, error: noticesError } = useQuery({
    queryKey: ['notices'],
    queryFn: () => NoticesService.getNotices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    if (!noticesData) return [];
    
    let filtered = [...noticesData];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(notice =>
        notice.noticeTitle.toLowerCase().includes(query) ||
        notice.noticeBody.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(notice => notice.category === filters.category);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return filters.sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [filters, noticesData]);

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedNotice(null);
    }, 300); // Small delay to allow animation
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/20">
      <Navbar />
      
      <div className="flex-grow pt-20 lg:pt-24">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-12 mb-6 relative overflow-hidden">
          {/* Subtle background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Bell className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Notice Board
              </h1>
              <Bell className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest announcements, events, and important information from the CPSCS Alumni Community
            </p>
          </div>
        </div>

        {/* Notice List with enhanced container */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Loading State */}
            {noticesLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading notices...</p>
              </div>
            )}

            {/* Error State */}
            {noticesError && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Notices</h2>
                <p className="text-muted-foreground max-w-md">
                  We're having trouble loading the latest notices. Please try again later.
                </p>
              </div>
            )}

            {/* Main Content - Only show when data is loaded */}
            {noticesData && !noticesLoading && (
              <>
                <NoticeHeader 
                  filters={filters}
                  onFiltersChange={setFilters}
                  totalNotices={filteredNotices.length}
                />
                
                <div className="p-6">
                  {filteredNotices.length === 0 ? (
                    <div className="text-center py-16">
                      <Bell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">No notices found</h3>
                      <p className="text-muted-foreground">
                        {filters.searchQuery 
                          ? "Try adjusting your search terms or filters"
                          : "Check back later for new announcements"
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredNotices.map((notice) => (
                        <NoticeCard
                          key={notice.id}
                          notice={notice}
                          onClick={() => handleNoticeClick(notice)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* VIP Sponsor Banner - Above Footer */}
      <VipSponsorBanner 
        bannerData={bannerResponse?.banner || null} 
        isLoading={bannerLoading}
      />
      
      <Footer />

      {/* Enhanced Notice Modal */}
      <NoticeModal
        notice={selectedNotice}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default NoticeBoard;
